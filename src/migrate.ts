/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import mongoose from "mongoose";
import { Logger } from "@bastion/tesseract";
import dotenv from "dotenv";

import GiveawayModel from "./models/Giveaway.js";
import GuildModel from "./models/Guild.js";
import MemberModel from "./models/Member.js";
import PollModel from "./models/Poll.js";
import RoleModel from "./models/Role.js";
import SelectRoleGroupModel from "./models/SelectRoleGroup.js";
import TriggerModel from "./models/Trigger.js";
import Settings from "./utils/settings.js";

// configure dotenv
dotenv.config();

// init
const settings = new Settings();

// every model whose indexes are managed by this script
const models = [
    GiveawayModel,
    GuildModel,
    MemberModel,
    PollModel,
    RoleModel,
    SelectRoleGroupModel,
    TriggerModel,
];

// commands
const Commands = {
    Indexes: "indexes",
};

// `npm run` strips anything that looks like a flag unless it's passed after a
// `--` separator, so the destructive mode is opted into with a plain word
const APPLY = "apply";

/**
 * Makes the indexes in MongoDB match the ones declared in the schemas.
 *
 * Indexes declared in a schema are built automatically when a shard boots, but
 * indexes that were *removed* from a schema are never dropped. This reconciles
 * both directions, so index changes don't have to be applied by hand.
 *
 * Anything not declared in a schema is dropped, so this only reports what it
 * intends to do until the changes are explicitly applied.
 * @param apply Whether to apply the changes, instead of only reporting them.
 */
const indexes = async (apply: boolean): Promise<void> => {
    // `autoIndex` builds the schema indexes as soon as a model is used against a
    // live connection, which would apply half the changes before reporting them
    await mongoose.connect(settings.mongoURI, { autoIndex: false });

    let changes = 0;

    for (const model of models) {
        const collection = model.collection.name;
        const { toDrop, toCreate } = await model.diffIndexes({ indexOptionsToCreate: true });

        if (!toDrop.length && !toCreate.length) continue;

        changes += toDrop.length + toCreate.length;

        for (const name of toDrop) {
            Logger.info(`${ collection }: drop ${ name }`);
        }

        for (const [ keys, options ] of toCreate) {
            Logger.info(`${ collection }: create ${ JSON.stringify(keys) } ${ JSON.stringify(options) }`);
        }

        if (apply) await model.syncIndexes();
    }

    if (!changes) return Logger.info("Every collection is already in sync.");

    if (apply) return Logger.info(`Applied ${ changes } index changes.`);

    Logger.info(`${ changes } index changes are pending. Re-run with "${ APPLY }" to apply them.`);
};

const main = async (): Promise<void> => {
    const [ , , command, ...flags ] = process.argv;

    switch (command?.toLowerCase()) {
    case Commands.Indexes: return await indexes(flags.includes(APPLY));
    default:
        throw new Error("You need to specify a migration command.", {
            cause: "None of the valid commands were used: " + Object.values(Commands).join(" / "),
        });
    }
};

main()
    .then(() => Logger.info("Migration completed successfully."))
    .catch(e => {
        Logger.info("Error when migrating. Join Bastion HQ for support: https://discord.gg/fzx8fkt");
        Logger.error(e);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
