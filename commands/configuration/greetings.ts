/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");
import * as embeds from "../../utils/embeds";

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
                boolean: [ "disable", "enable", "random" ],
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
                "greetings --random",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update guild greeting settings
        guild.document.greeting = {
            channelId: argv.enable ? message.channel.id : argv.disable ? undefined : guild.document.greeting ? guild.document.greeting.channelId : undefined,
            message: argv._.length ? embeds.generateBastionEmbed(argv._.join(" ")) : argv.random ? undefined : guild.document.greeting ? guild.document.greeting.message : undefined,
            timeout: typeof argv.timeout === "number" ? argv.timeout : guild.document.greeting ? guild.document.greeting.timeout : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: "```json\n" + JSON.stringify(guild.document.greeting.message ? embeds.generateEmbed(guild.document.greeting.message) : {}) + "```",
                footer: {
                    text: "Greeting Preview • " + (message.guild.channels.cache.has(guild.document.greeting.channelId) ? message.guild.channels.cache.get(guild.document.greeting.channelId).name : "Disabled")
                        + (typeof guild.document.greeting.timeout === "number" ? " • " + (guild.document.greeting.timeout + " minutes") : ""),
                },
            },
        });
    }
}
