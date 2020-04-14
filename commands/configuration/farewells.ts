/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

import { MessageEmbedData } from "../../typings/discord";

export = class Farewells extends Command {
    constructor() {
        super("farewells", {
            description: "It allows you to enable (and disable) farewells in the server. It also allows you to set farewell message and timeout.",
            triggers: [],
            arguments: {
                alias: {
                    disable: [ "d" ],
                    enable: [ "e" ],
                    timeout: [ "t" ],
                },
                boolean: [ "disable", "enable" ],
                number: [ "timeout" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "farewells --enable",
                "farewells --disable",
                "farewells --timeout TIMEOUT_IN_MINUTES",
                "farewells -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update guild farewell settings
        guild.document.farewell = {
            channelId: argv.enable ? message.channel.id : argv.disable ? undefined : guild.document.farewell ? guild.document.farewell.channelId : undefined,
            message: argv._.length ? JSON.parse(argv._.join(" ")) : guild.document.farewell ? guild.document.farewell.message : undefined,
            timeout: typeof argv.timeout === "number" ? argv.timeout : guild.document.farewell ? guild.document.farewell.timeout : undefined,
        };

        // overwrite footer
        const embed: MessageEmbedData = guild.document.farewell.message || {};
        if (embed) {
            embed.footer = {};
            embed.footer.text = "Farewell Preview • "
                + (message.guild.channels.cache.has(guild.document.farewell.channelId) ? message.guild.channels.cache.get(guild.document.farewell.channelId).name : "Disabled")
                + (typeof guild.document.farewell.timeout === "number" ? " • " + guild.document.farewell.timeout : "");
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send(embed.content, {
            embed,
        }).catch(() => {
            // this error can be ignored
        });
    }
}
