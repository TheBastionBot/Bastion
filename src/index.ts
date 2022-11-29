/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as path from "path";
import { Logger, ShardingManager, WebServer } from "@bastion/tesseract";
import * as DiscordRPC from "discord-rpc";
import * as dotenv from "dotenv";
import { gray } from "picocolors";

import * as settings from "./utils/settings";

// configure dotenv
dotenv.config();

// connect to Discord via IPC
const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.login({ clientId: "267035345537728512" }).catch(Logger.ignore);

// Sharding Manager
const Manager = new ShardingManager(
    path.resolve(path.dirname(__filename).split(path.sep).pop(), "bastion" + path.extname(__filename)),
);

// Spawn shards
Manager.spawn().catch(Logger.error);

// Sharding Manager Events
Manager.on("shardCreate", shard => {
    Logger.info(`Shard ${shard.id} — Launching ${ gray(`[ ${shard.id + 1} of ${ Manager.totalShards } ]`) }`);
});

// Tesseract Web Server
const port = process.env.PORT || process.env.BASTION_API_PORT || settings.get()?.port;
const auth = process.env.BASTION_API_AUTH || settings.get()?.auth;
if (port && auth) {
    const server = new WebServer(Manager);
    server.start();
}

// RPC Events
rpc.on("ready", () => {
    rpc.setActivity({
        details: "bastion.traction.one",
        state: "discord.gg/fzx8fkt",
        startTimestamp: new Date(),
        largeImageKey: "d14ad8a2971e36cd54aa0ddc6be6d29b",
        largeImageText: "Bastion",
        smallImageKey: "b7b407c827109b547ce91a08e7f9168b",
        smallImageText: "by TRACTION",
        instance: false,
    });
});

process.on("SIGINT", () => {
    rpc.destroy()
    .then(() => process.exit())
    .catch(Logger.error);
});
