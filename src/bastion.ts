/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GatewayIntentBits, Options, Partials } from "discord.js";
import { Client, Logger } from "@bastion/tesseract";
import dotenv from "dotenv";

// configure dotenv
dotenv.config();

const bastion = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
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
    ],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: {
            maxSize: 5,
        },
    }),
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            interval: 36e2,
            lifetime: 9e2,
        },
    },
});

bastion.init();

process.on("SIGINT", () => {
    bastion.destroy();
    bastion.disconnectMongo()
        .then(() => process.exit())
        .catch(Logger.error);
});
