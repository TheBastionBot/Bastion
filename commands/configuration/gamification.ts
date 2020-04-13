/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as gamification from "../../utils/gamification";

import BastionGuild = require("../../structures/Guild");

export = class Gamification extends Command {
    constructor() {
        super("gamification", {
            description: "It allows you to enable (or disable) gamification in the server. When enabled, users gain experience and level up in the server by participating in the server, competing against each other to climb the leaderboard. It also allows you to toggle level up messages and set the level up modifier.",
            triggers: [],
            arguments: {
                boolean: [ "messages" ],
                number: [ "modifier" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "gamification",
                "gamification --messages",
                "gamification --modifier NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        const status = (argv.messages || argv.modifier) ? true : !(guild.document.gamification && guild.document.gamification.enabled);

        guild.document.gamification = {
            // enable gamification if either messages or modifier is specified, otherwise toggle it
            enabled: status,
            // enable level up messages if specified, otherwise keep the old value based on whether gamification is enabled
            messages: argv.messages ? true : status ? guild.document.gamification && guild.document.gamification.messages : undefined,
            // set the level up modifier if specified, otherwise keep the old value based on whether gamification is enabled
            modifier: argv.modifier ? Number(argv.modifier) : status ? guild.document.gamification && guild.document.gamification.modifier : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.gamification.enabled ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString("en_us", "info", guild.document.gamification.enabled ? "gamificationEnable" : "gamificationDisable", message.author.tag),
                fields: guild.document.gamification.enabled
                ? [
                    {
                        name: "Level-Up Messages",
                        value: guild.document.gamification.messages ? "Enabled" : "Disabled",
                        inline: true,
                    },
                    {
                        name: "Level-Up Modifier",
                        value: guild.document.gamification.modifier ? guild.document.gamification.modifier.toString() : gamification.DEFAUL_LEVELUP_MODIFIER.toString(),
                        inline: true,
                    },
                  ]
                : [],
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
