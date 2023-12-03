/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildTextBasedChannel, Snowflake } from "discord.js";
import { Logger, Scheduler } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import memcache from "../utils/memcache.js";
import * as requests from "../utils/requests.js";
import { COLORS } from "../utils/constants.js";
import { TWITCH_CHANNEL } from "../utils/regex.js";
import Settings from "../utils/settings.js";
import { TwitchStream } from "../types.js";

const TWITCH_CACHE_NAMESPACE = "twitchStreams";

class LiveStreamNotificationScheduler extends Scheduler {
    constructor() {
        super("liveStreams", "0 */5 * * * *");  // every 5 minutes

        // twitch streams for which the guilds have received notifications
        memcache.set(TWITCH_CACHE_NAMESPACE, new Map<Snowflake, string[]>());
    }

    public async exec(): Promise<void> {
        try {
            // check whether the client is ready
            if (!this.client.isReady()) return;

            // check whether the guild cache is empty
            if (!this.client.guilds.cache.size) return;

            const guildDocuments = await GuildModel.find({
                $or: this.client.guilds.cache.map(g => ({ _id: g.id })),
                twitchNotificationChannel: { $exists: true, $ne: null },
                twitchNotificationUsers: { $exists: true, $type: "array", $ne: [] },
            });

            const twitchStreams = memcache.get(TWITCH_CACHE_NAMESPACE) as Map<Snowflake, string[]>;

            for (const guild of guildDocuments) {
                // twitch streams
                const twitchNotificationUsers = guild.twitchNotificationUsers.filter(u => TWITCH_CHANNEL.test(u));
                if (guild.twitchNotificationChannel && this.client.guilds.cache.get(guild.id).channels.cache.has(guild.twitchNotificationChannel) && twitchNotificationUsers?.length) {
                    // get current live streams
                    const { body, statusCode } = await requests.get("https://api.twitch.tv/helix/streams/?user_login=" + twitchNotificationUsers.join("&user_login="), {
                        "authorization": "Bearer " + (this.client.settings as Settings).get("twitch").accessToken,
                        "client-id": (this.client.settings as Settings).get("twitch").clientId,
                    });

                    if (statusCode >= 400) {
                        return Logger.error(await body.json());
                    }

                    const streams: TwitchStream[] = (await body.json())?.["data"] || [];

                    // streams that were already notified
                    if (!twitchStreams.has(guild.id)) twitchStreams.set(guild.id, []);
                    const notifiedStreams = twitchStreams.get(guild.id).filter(user => streams.some(s => s.user_name === user));

                    for (const stream of streams) {
                        // check whether this stream has already been notified
                        if (notifiedStreams.includes(stream.user_name)) continue;

                        // notify
                        await (this.client.guilds.cache.get(guild.id).channels.cache.get(guild.twitchNotificationChannel) as GuildTextBasedChannel).send({
                            content: guild.twitchNotificationMessage,
                            embeds: [
                                {
                                    color: COLORS.TWITCH,
                                    author: {
                                        name: stream.user_name,
                                        url: "https://twitch.tv/" + stream.user_name,
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
                                },
                            ],
                        }).then(() => notifiedStreams.push(stream.user_name)).catch(Logger.ignore);
                    }

                    // save notified streams
                    twitchStreams.set(guild.id, notifiedStreams);
                }
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}

export { LiveStreamNotificationScheduler as Scheduler };
