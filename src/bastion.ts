/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GatewayIntentBits, GuildMember, Options, Partials, User } from "discord.js";
import { Client, Logger } from "@bastion/tesseract";
import dotenv from "dotenv";

import Settings from "./utils/settings.js";

// configure dotenv
dotenv.config({ quiet: true });

// voice members are retained, as voice sessions and experience are tracked from the cache
const isRetainedMember = (member: GuildMember): boolean => member.id === member.client.user.id || Boolean(member.voice.channelId);

const isRetainedUser = (user: User): boolean => user.id === user.client.user.id;

const bastion = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        // GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildWebhooks,
        // GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildScheduledEvents,
        // GatewayIntentBits.AutoModerationConfiguration,
        // GatewayIntentBits.AutoModerationExecution,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User,
    ],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: {
            maxSize: 5,
        },
        GuildMemberManager: {
            maxSize: 250,
            keepOverLimit: isRetainedMember,
        },
        UserManager: {
            maxSize: 50_000,
            keepOverLimit: isRetainedUser,
        },
        PresenceManager: 0,
    }),
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            interval: 36e2,
            lifetime: 9e2,
        },
        guildMembers: {
            interval: 36e2,
            filter: () => member => !isRetainedMember(member),
        },
        users: {
            interval: 36e2,
            filter: () => user => !isRetainedUser(user),
        },
    },
    tesseractSettings: new Settings(),
});

bastion.init();

process.on("SIGINT", () => {
    bastion.destroy();
    bastion.disconnectMongo()
        .then(() => process.exit())
        .catch(Logger.error);
});
