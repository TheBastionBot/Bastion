/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as tesseract from "@bastion/tesseract";
import * as chalk from "chalk";
import * as DiscordRPC from "discord-rpc";

import { BastionConfigurations } from "./typings/settings";
import * as manifest from "./package.json";


const configurations = tesseract.settings.getConfigurations() as BastionConfigurations;


process.env.BASTION_BOOT_TIME = Date.now().toString();

process.stdout.write("\n");
process.stdout.write(chalk`{cyan Bastion} {grey v${manifest.version}}\n`);
process.stdout.write(chalk`{blue ${manifest.homepage}}\n`);
process.stdout.write("\n");
process.stdout.write(chalk`{gray </> with ❤ by The Bastion Bot Team & Contributors}\n`);
process.stdout.write(chalk`{gray Copyright © 2017-2020 The Bastion Bot Project}\n`);
process.stdout.write("\n");


// Connect to Discord via IPC
const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.login({ clientId: "267035345537728512" }).catch(() => {
    // This error can be ignored.
});


// Sharding Manager
const Manager = new tesseract.ShardingManager(
    "./bastion.js",
);


// Tesseract Web Server
const server = new tesseract.WebServer(Manager);
server.start(process.env.PORT || configurations.port);


// Spawn shards
Manager.spawn().catch(tesseract.Logger.error);


// Sharding Manager Events
Manager.on("shardCreate", shard => {
    tesseract.Logger.info(chalk`Shard ${shard.id} - Launching {grey [ ${shard.id + 1} of ${Manager.totalShards} ]}`);
});

// RPC Events
rpc.on("ready", () => {
    rpc.setActivity({
        details: "bastion.traction.one",
        state: "discord.gg/fzx8fkt",
        startTimestamp: new Date(),
        largeImageKey: "f2be54a6b3bc34a5b849fdeb2e550d68",
        largeImageText: "Bastion",
        smallImageKey: "b7b407c827109b547ce91a08e7f9168b",
        smallImageText: "iamtraction#8383",
        instance: false,
    });
});
