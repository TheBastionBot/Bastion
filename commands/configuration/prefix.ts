/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class Prefix extends Command {
    constructor() {
        super("prefix", {
            description: "It allows you set custom prefixes for Bastion in your server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "prefix",
                "prefix -- PREFIX",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const guild = (message.guild as BastionGuild);

        if (argv._.length && argv._.length <= 10) {
            // set guild prefixes
            guild.document.prefixes = argv._;

            // save document
            await guild.document.save();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "guildPrefixUpdate", message.author.tag, guild.document.prefixes.join("  ")),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // get the guild prefixes
        const prefixes = this.client.configurations.prefixes.concat(guild.document.prefixes);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: this.client.locale.getString("en_us", "info", "guildPrefixes"),
                fields: [
                    {
                        name: "Prefixes",
                        value: prefixes.join("  "),
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
