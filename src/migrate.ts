/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Logger } from "@bastion/tesseract";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

import * as yaml from "./utils/yaml";

// configure dotenv
dotenv.config();

const settings = yaml.parse("settings.yaml");

const client = new MongoClient(settings?.mongoURI || process.env.TESSERACT_MONGO_URI);

const main = async () => {
    await client.connect();
    const db = client.db();

    // Case
    if (await db.collection("cases").findOne()) {
        Logger.info("Dropping Case collection...");
        await db.collection("cases").drop();
        Logger.info("Dropped Case collection.");
    }

    // Config
    if (await db.collection("configs").findOne()) {
        Logger.info("Dropping Config collection...");
        await db.collection("configs").drop();
        Logger.info("Dropped Config collection.");
    }

    // Giveaway
    if (await db.collection("giveaways").findOne()) {
        Logger.info("Dropping Giveaway collection...");
        await db.collection("giveaways").drop();
        Logger.info("Dropped Giveaway collection.");
    }

    // Guild
    if (await db.collection("guilds").findOne()) {
        Logger.info("Migrating Guild documents...");
        const Guild = db.collection("guilds");
        await Guild.updateMany({}, {
            $rename: {
                moderationLogChannelId: "moderationLogChannel",
                serverLogChannelId: "serverLogChannel",
                suggestionsChannelId: "suggestionsChannel",
                starboardChannelId: "starboardChannel",
                reportsChannelId: "reportsChannel",
                streamerRoleId: "streamerRole",
                verifiedRoleId: "verifiedRole",
            },
            $unset: {
                announcementsChannelId: 1,
                chat: 1,
                disabled: 1,
                disabledCommands: 1,
                farewell: 1,
                filters: 1,
                gambling: 1,
                gamification: 1,
                greeting: 1,
                infractions: 1,
                language: 1,
                membersOnly: 1,
                mentionSpam: 1,
                moderationCaseCount: 1,
                music: 1,
                reactionAnnouncements: 1,
                reactionPinning: 1,
                referralsChannel: 1,
                streamers: 1,
                voiceSessions: 1,
            },
        });
        Logger.info("Migrated Guild documents.");
    }

    // Member
    // if (await db.collection("members").findOne()) {}

    // Playlist
    if (await db.collection("playlists").findOne()) {
        Logger.info("Dropping Playlist collection...");
        await db.collection("playlists").drop();
        Logger.info("Dropped Playlist collection.");
    }

    // Poll
    if (await db.collection("polls").findOne()) {
        Logger.info("Dropping Poll collection...");
        await db.collection("polls").drop();
        Logger.info("Dropped Poll collection.");
    }

    // ReactionRoleGroup
    if (await db.collection("reactionrolegroups").findOne()) {
        Logger.info("Dropping ReactionRoleGroup collection...");
        await db.collection("reactionrolegroups").drop();
        Logger.info("Dropped ReactionRoleGroup collection.");
    }

    // Role
    if (await db.collection("roles").findOne()) {
        Logger.info("Migrating Role documents...");
        const Role = db.collection("roles");
        await Role.updateMany({}, {
            $unset: {
                autoAssignable: 1,
                blacklisted: 1,
                disabledCommands: 1,
                emoji: 1,
            }
        });
        Logger.info("Migrated Role documents.");
    }

    // TextChannel
    if (await db.collection("textchannels").findOne()) {
        Logger.info("Dropping TextChannel collection...");
        await db.collection("textchannels").drop();
        Logger.info("Dropped TextChannel collection.");
    }

    // Trigger
    if (await db.collection("triggers").findOne()) {
        Logger.info("Dropping Trigger collection...");
        await db.collection("triggers").drop();
        Logger.info("Dropped Trigger collection.");
    }

    // User
    if (await db.collection("users").findOne()) {
        Logger.info("Dropping User collection...");
        await db.collection("users").drop();
        Logger.info("Dropped User collection.");
    }
};

main()
.then(() => Logger.info("Migration completed successfully."))
.catch(e => {
    Logger.info("Error when migrating. Join Bastion HQ for support: https://discord.gg/fzx8fkt");
    Logger.error(e);
})
.finally(() => client.close());
