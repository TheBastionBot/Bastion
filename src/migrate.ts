/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { readdir } from "node:fs/promises";
import mongoose, { type Model } from "mongoose";
import { Logger } from "@bastion/tesseract";
import dotenv from "dotenv";

import Settings from "./utils/settings.js";

// configure dotenv
dotenv.config({ quiet: true });

// init
const settings = new Settings();

const APPLY = "apply";

// collections MongoDB keeps for itself, which no model will ever declare
const SYSTEM_COLLECTION = /^system\./;

/**
 * Loads every model declared in the models directory.
 */
const loadModels = async (): Promise<Model<unknown>[]> => {
    const directory = new URL("./models/", import.meta.url);

    const modules = (await readdir(directory)).filter(file => file.endsWith(".js"));

    return await Promise.all(modules.map(async module => (await import(new URL(module, directory).href)).default as Model<unknown>));
};

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
    let changes = 0;

    for (const model of await loadModels()) {
        const collection = model.collection.name;
        const { toDrop, toCreate } = await model.diffIndexes({ indexOptionsToCreate: true });

        if (!toDrop.length && !toCreate.length) continue;

        changes += toDrop.length + toCreate.length;

        for (const name of toDrop) {
            console.log(`${ collection }: drop ${ name }`);
        }

        for (const [ keys, options ] of toCreate) {
            console.log(`${ collection }: create ${ JSON.stringify(keys) } ${ JSON.stringify(options) }`);
        }

        if (apply) await model.syncIndexes();
    }

    if (!changes) return console.log("Every collection is already in sync.");

    if (apply) return console.log(`Applied ${ changes } index changes.`);

    console.log(`${ changes } index changes are pending. Re-run with "${ APPLY }" to apply them.`);
};

/**
 * Reports every collection in the database, and drops the dead ones.
 *
 * Dropping a collection can't be undone, so this only reports what it intends
 * to do until the changes are explicitly applied.
 * @param apply Whether to drop the dead collections, instead of only reporting them.
 */
const collections = async (apply: boolean): Promise<void> => {
    const db = mongoose.connection.db;
    const declared = new Set((await loadModels()).map(model => model.collection.name));

    const names = (await db.listCollections().toArray())
        .filter(collection => collection.type === "collection" && !SYSTEM_COLLECTION.test(collection.name))
        .map(collection => collection.name)
        .sort();

    const width = Math.max("collection".length, ...names.map(name => name.length));
    const dead: string[] = [];

    console.log(`${ "collection".padEnd(width) }  documents`);

    for (const name of names) {
        const documents = await db.collection(name).countDocuments();
        const modelled = declared.has(name);

        if (!modelled) dead.push(name);

        console.log(`${ name.padEnd(width) }  ${ documents }${ modelled ? "" : "  — no model" }`);
    }

    console.log();

    if (!dead.length) return console.log(`${ names.length } collections, none of them dead.`);

    if (!apply) return console.log(`${ names.length } collections, ${ dead.length } of them dead. Re-run with "${ APPLY }" to drop ${ dead.length === 1 ? "it" : "them" }.`);

    for (const name of dead) {
        await db.dropCollection(name);
        console.log(`Dropped ${ name }.`);
    }
};

// commands
const Commands: Record<string, (apply: boolean) => Promise<void>> = {
    collections,
    indexes,
};

const main = async (): Promise<void> => {
    const [ , , name, ...flags ] = process.argv;
    const command = name?.toLowerCase();

    if (!Object.hasOwn(Commands, command || "")) {
        throw new Error("You need to specify a migration command.", {
            cause: "None of the valid commands were used: " + Object.keys(Commands).join(" / "),
        });
    }

    await mongoose.connect(settings.mongoURI, { autoIndex: false });

    await Commands[command](flags.some(flag => flag.toLowerCase() === APPLY));
};

main()
    .catch(e => {
        console.error("Error when migrating. Join Bastion HQ for support: https://discord.gg/fzx8fkt");
        Logger.error(e);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
