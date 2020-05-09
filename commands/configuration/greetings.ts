/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

import { MessageEmbedData } from "../../typings/discord";

export = class Greetings extends Command {
    constructor() {
        super("greetings", {
            description: "It allows you to enable (and disable) greetings in the server. It also allows you to set greeting message and timeout.",
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
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "greetings --enable",
                "greetings --disable",
                "greetings --timeout TIMEOUT_IN_MINUTES",
                "greetings -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update guild greeting settings
        guild.document.greeting = {
            channelId: argv.enable ? message.channel.id : argv.disable ? undefined : guild.document.greeting ? guild.document.greeting.channelId : undefined,
            message: argv._.length ? JSON.parse(argv._.join(" ")) : guild.document.greeting ? guild.document.greeting.message : undefined,
            timeout: typeof argv.timeout === "number" ? argv.timeout : guild.document.greeting ? guild.document.greeting.timeout : undefined,
        };

        // overwrite footer
        const embed: MessageEmbedData = guild.document.greeting.message || {};
        if (embed) {
            embed.footer = {};
            embed.footer.text = "Greeting Preview • "
                + (message.guild.channels.cache.has(guild.document.greeting.channelId) ? message.guild.channels.cache.get(guild.document.greeting.channelId).name : "Disabled")
                + (typeof guild.document.greeting.timeout === "number" ? " • " + guild.document.greeting.timeout : "");
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
