/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as duration from "../../utils/durations";
import * as omnic from "../../utils/omnic";
import { version as bastionVersion } from "../../package.json";

export = class StatusCommand extends Command {
    constructor() {
        super("status", {
            description: "It allows you to see Bastion's status, at a glance. It also allows you to see status of the current shard.",
            triggers: [ "stats" ],
            arguments: {
                boolean: [ "shard" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "status",
                "status --shard",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // check for premium membership
        const isPremiumGuild = await omnic.isPremiumGuild(message.guild).catch(() => {
            // this error can be ignored
        });

        // calculate Bastion's presence
        const guildCounts = await this.client.shard.broadcastEval("this.guilds.cache.size");
        const guildCount = argv.shard ? this.client.guilds.cache.size : guildCounts.reduce((acc, val) => acc + val, 0);

        const userCounts = argv.shard ? this.client.guilds.cache.map(g => g.memberCount) : await this.client.shard.broadcastEval("this.guilds.cache.map(g => g.memberCount).reduce((acc, val) => acc + val, 0)");
        const userCount = userCounts.reduce((acc, val) => acc + val, 0);

        // calculate memory usage
        const rss = await this.client.shard.broadcastEval("process.memoryUsage().rss");
        const memoryUsage = argv.shard ? process.memoryUsage().rss : rss.reduce((acc, val) => acc + val, 0);


        const info = [
            {
                name: "Developer",
                value: "[" + this.client.locale.getConstant("author.username") + "](" + this.client.locale.getConstant("author.url") + ")",
                inline: true
            },
            {
                name: "Bot ID",
                value: this.client.user.id,
                inline: true
            },
            {
                name: "Bot Owners",
                value: this.client.credentials.owners.join("\n") || "-",
                inline: true
            },
            {
                name: "Default Prefixes",
                value: this.client.configurations.prefixes.join(" "),
                inline: true
            },
            {
                name: "Shards",
                value: this.client.shard.count.toString(),
                inline: true
            },
        ];

        const stats = [
            {
                name: "Presence",
                value: guildCount + " Servers\n" + userCount + " Users",
                inline: true
            },
            {
                name: "Uptime",
                value: duration.humanize(duration.between(Date.now(), Number.parseInt(process.env.BASTION_BOOT_TIME))),
                inline: true
            },
            {
                name: "Memory Usage",
                value: (memoryUsage / 1024 / 1024).toFixed(2) + "MB",
                inline: true
            },
            {
                name: "Environment",
                value: "Node " + process.version + " on " + process.platform + " " + process.arch + ". " + (constants.isPublicBastion(this.client.user) ? "Connected via Starlink." : ""),
                inline: true
            },
        ];


        // acknowledge
        await message.channel.send({
            embed: {
                color: isPremiumGuild ? constants.COLORS.GOLD : Constants.COLORS.IRIS,
                author: {
                    name: "Bastion" + (isPremiumGuild ? " Gold" : "") + " v" + bastionVersion,
                    url: this.client.locale.getConstant("bastion.website"),
                },
                title: (argv.shard ? "Shard " + this.client.shard.ids.join(" / ") : "") + " Status",
                url: this.client.locale.getConstant("bastion.website") + "/status",
                thumbnail: {
                    url: this.client.user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                fields: argv.shard ? stats : info.concat(stats),
                footer: {
                    text: (argv.shard ? "" : "Shard " + this.client.shard.ids.join(" / ") + " • ") + this.client.ws.ping + "ms",
                },
                timestamp: new Date(),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
