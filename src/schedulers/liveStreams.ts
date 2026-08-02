/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed, GuildTextBasedChannel, Snowflake } from "discord.js";
import { Logger, Scheduler } from "@bastion/tesseract";

import GuildModel, { Guild } from "../models/Guild.js";
import * as arrays from "../utils/arrays.js";
import * as requests from "../utils/requests.js";
import { COLORS } from "../utils/constants.js";
import { TWITCH_CHANNEL } from "../utils/regex.js";
import { twitchHeaders } from "../utils/twitch.js";
import Settings from "../utils/settings.js";
import { TwitchStream } from "../types.js";

/** The most channels Twitch's streams endpoint accepts, and reports on, in one request. */
const TWITCH_BATCH_SIZE = 100;
/** How many guilds are announced to at a time. */
const NOTIFICATION_CONCURRENCY = 8;
/** How long before this shard started watching a stream can have begun and still be announced, in milliseconds. */
const NOTIFICATION_GRACE = 6e5;

/** A channel waiting to hear when a Twitch channel goes live. */
interface StreamSubscriber {
    channel: GuildTextBasedChannel;
    message?: string;
}

/** A live stream, and one of the channels waiting to hear about it. */
interface StreamNotification {
    stream: TwitchStream;
    login: string;
    embeds: APIEmbed[];
    subscriber: StreamSubscriber;
}

const buildEmbed = (stream: TwitchStream): APIEmbed => ({
    color: COLORS.TWITCH,
    author: {
        name: stream.user_name,
        url: "https://twitch.tv/" + stream.user_login,
    },
    description: stream.title,
    fields: [
        {
            name: "Viewers",
            value: stream.viewer_count.toLocaleString(),
            inline: true,
        },
        {
            name: "Language",
            value: stream.language.toUpperCase(),
            inline: true,
        },
    ],
    image: {
        url: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720"),
    },
    footer: {
        text: "🔴 LIVE",
    },
    timestamp: stream.started_at,
});

class LiveStreamNotificationScheduler extends Scheduler {
    /** The stream each guild was last told about, per Twitch channel it follows. Rebuilt every sweep. */
    private notified = new Map<Snowflake, Map<string, string>>();

    /** Whether a sweep is still running, since cron starts the next one regardless. */
    private sweeping = false;

    /** When this shard started watching. */
    private readonly bootedAt = Date.now();

    constructor() {
        super("liveStreams", "0 */5 * * * *");  // every 5 minutes
    }

    /** Collects the guilds following each Twitch channel. */
    private resolveSubscribers(guildDocuments: Guild[]): Map<string, StreamSubscriber[]> {
        const subscribers = new Map<string, StreamSubscriber[]>();

        for (const guild of guildDocuments) {
            const channel = this.client.guilds.cache.get(guild.id)?.channels.cache.get(guild.twitchNotificationChannel) as GuildTextBasedChannel;
            if (!channel) continue;

            const subscriber: StreamSubscriber = { channel, message: guild.twitchNotificationMessage };

            for (const user of guild.twitchNotificationUsers) {
                if (!TWITCH_CHANNEL.test(user)) continue;

                const login = user.toLowerCase();
                if (!subscribers.has(login)) subscribers.set(login, []);
                subscribers.get(login).push(subscriber);
            }
        }

        return subscribers;
    }

    /**
     * Looks up which of the specified channels are currently live, a batch of channels at a time.
     * Reports the channels it got an answer for alongside them. a batch Twitch refused says nothing
     * about whether its channels are live, which isn't the same as them having gone offline.
     */
    private async fetchLiveStreams(logins: string[]): Promise<{ streams: TwitchStream[]; answered: Set<string>; }> {
        const streams: TwitchStream[] = [];
        const answered = new Set<string>();
        const headers = twitchHeaders(this.client.settings as Settings);

        for (const batch of arrays.chunks(logins, TWITCH_BATCH_SIZE)) {
            const query = new URLSearchParams([
                [ "first", `${ TWITCH_BATCH_SIZE }` ],
                ...batch.map(login => [ "user_login", login ]),
            ]);

            try {
                const { body, statusCode } = await requests.get("https://api.twitch.tv/helix/streams?" + query.toString(), headers);

                if (statusCode >= 400) {
                    Logger.error(`Twitch responded with ${ statusCode } for ${ batch.length } channels: ${ await body.text() }`);

                    // a rejected token or an exhausted rate limit applies to every remaining batch too
                    if (statusCode === 401 || statusCode === 429) break;

                    continue;
                }

                const data = (await body.json())?.["data"] as TwitchStream[];
                streams.push(...(data || []).filter(stream => stream.type === "live"));

                for (const login of batch) answered.add(login);
            } catch (e) {
                Logger.error(e);
            }
        }

        return { streams, answered };
    }

    /** Announces the streams a single guild hasn't been told about yet, in the order they were found. */
    private async notifyGuild(notifications: StreamNotification[], notified: Map<string, string>): Promise<void> {
        for (const { stream, login, embeds, subscriber } of notifications) {
            // check whether this stream has already been notified
            if (notified.get(login) === stream.id) continue;

            // adopt whatever was already live before this shard started watching, instead of announcing it again
            if (Date.parse(stream.started_at) < this.bootedAt - NOTIFICATION_GRACE) {
                notified.set(login, stream.id);
                continue;
            }

            await subscriber.channel.send({ content: subscriber.message, embeds })
                .then(() => notified.set(login, stream.id))
                .catch(Logger.ignore);
        }
    }

    public async exec(): Promise<void> {
        // a sweep can outlast the five minutes it has before the next one starts. cron doesn't wait for
        // it, and two of them running at once would announce over each other and lose what was announced
        if (this.sweeping) return;
        this.sweeping = true;

        try {
            // check whether the client is ready
            if (!this.client.isReady()) return;

            // check whether the guild cache is empty
            if (!this.client.guilds.cache.size) return;

            const guildDocuments = await GuildModel.find({
                _id: { $in: [ ...this.client.guilds.cache.keys() ] },
                twitchNotificationChannel: { $exists: true, $ne: null },
                twitchNotificationUsers: { $exists: true, $type: "array", $ne: [] },
            });

            const subscribers = this.resolveSubscribers(guildDocuments);
            const { streams, answered } = await this.fetchLiveStreams([ ...subscribers.keys() ]);

            // group the live streams by the guilds waiting to hear about them, rendering each stream only once
            // however many guilds it's going out to
            const live = new Set<string>();
            const notifications = new Map<Snowflake, StreamNotification[]>();
            for (const stream of streams) {
                const login = stream.user_login?.toLowerCase();
                live.add(login);

                const embeds = [ buildEmbed(stream) ];
                for (const subscriber of subscribers.get(login) || []) {
                    const { guildId } = subscriber.channel;

                    if (!notifications.has(guildId)) notifications.set(guildId, []);
                    notifications.get(guildId).push({ stream, login, embeds, subscriber });
                }
            }

            // rebuild the state around what's still being followed, so that channels a guild has since
            // dropped, and guilds bastion has since left, don't linger for the life of the process
            const previous = this.notified;
            this.notified = new Map<Snowflake, Map<string, string>>();
            for (const [ login, guildSubscribers ] of subscribers) {
                // a channel twitch answered for and didn't report as live has gone offline, and is
                // forgotten so that it's announced again next time; one it stayed quiet about is kept
                if (answered.has(login) && !live.has(login)) continue;

                for (const { channel } of guildSubscribers) {
                    const stream = previous.get(channel.guildId)?.get(login);
                    if (!stream) continue;

                    if (!this.notified.has(channel.guildId)) this.notified.set(channel.guildId, new Map<string, string>());
                    this.notified.get(channel.guildId).set(login, stream);
                }
            }

            // announce to several guilds at once
            for (const batch of arrays.chunks([ ...notifications ], NOTIFICATION_CONCURRENCY)) {
                await Promise.all(batch.map(([ guildId, guildNotifications ]) => {
                    if (!this.notified.has(guildId)) this.notified.set(guildId, new Map<string, string>());

                    return this.notifyGuild(guildNotifications, this.notified.get(guildId));
                }));
            }
        } catch (e) {
            Logger.error(e);
        } finally {
            this.sweeping = false;
        }
    }
}

export { LiveStreamNotificationScheduler as Scheduler };
