/*!
 * @author Sankarsan Kampa (iamtraction)
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
                boolean: [ "disable", "enable", "private", "random" ],
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
                "greetings --random",
                "greetings --timeout TIMEOUT_IN_MINUTES",
                "greetings -- MESSAGE",
                "greetings --private -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update guild greeting settings
        guild.document.greeting = {
            channelId: argv.enable ? message.channel.id : argv.disable ? undefined : guild.document.greeting ? guild.document.greeting.channelId : undefined,
            message: argv._.length && !argv.private ? embeds.generateBastionEmbed(argv._.join(" ")) : argv.random ? undefined : guild.document.greeting ? guild.document.greeting.message : undefined,
            privateMessage: argv.private ? argv._.length ? embeds.generateBastionEmbed(argv._.join(" ")) : undefined : guild.document.greeting ? guild.document.greeting.privateMessage : undefined,
            timeout: typeof argv.timeout === "number" ? argv.timeout : guild.document.greeting ? guild.document.greeting.timeout : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: message.guild.channels.cache.has(guild.document.greeting.channelId) ? Constants.COLORS.IRIS : Constants.COLORS.RED,
                title: "Greetings " + (message.guild.channels.cache.has(guild.document.greeting.channelId) ? "Enabled" : "Disabled"),
                fields: [
                    {
                        name: "Message",
                        value: guild.document.greeting.message
                            ?   "```json\n" + JSON.stringify(guild.document.greeting.message ? embeds.generateEmbed(guild.document.greeting.message) : {}) + "```"
                            :   "[Default Messages]",
                    },
                    {
                        name: "Private Message",
                        value: guild.document.greeting.privateMessage
                            ?   "```json\n" + JSON.stringify(guild.document.greeting.privateMessage ? embeds.generateEmbed(guild.document.greeting.privateMessage) : {}) + "```"
                            :   "[Not Set]",
                    },
                ],
                footer: {
                    text: (message.guild.channels.cache.has(guild.document.greeting.channelId) ? "Channel #" + message.guild.channels.cache.get(guild.document.greeting.channelId).name + " • " : "")
                        + (typeof guild.document.greeting.timeout === "number" && guild.document.greeting.timeout ? "Timeout - " + (guild.document.greeting.timeout + " minutes") : "No Timeout"),
                },
            },
        });
    }
}
