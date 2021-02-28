/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");
import * as embeds from "../../utils/embeds";

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
                "farewells --enable",
                "farewells --disable",
                "farewells --timeout TIMEOUT_IN_MINUTES",
                "farewells -- MESSAGE",
                "farewells --random",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update guild farewell settings
        guild.document.farewell = {
            channelId: argv.enable ? message.channel.id : argv.disable ? undefined : guild.document.farewell ? guild.document.farewell.channelId : undefined,
            message: argv._.length ? embeds.generateBastionEmbed(argv._.join(" ")) : argv.random ? undefined : guild.document.farewell ? guild.document.farewell.message : undefined,
            timeout: typeof argv.timeout === "number" ? argv.timeout : guild.document.farewell ? guild.document.farewell.timeout : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: message.guild.channels.cache.has(guild.document.farewell.channelId) ? Constants.COLORS.IRIS : Constants.COLORS.RED,
                title: "Farewells " + (message.guild.channels.cache.has(guild.document.farewell.channelId) ? "Enabled" : "Disabled"),
                fields: [
                    {
                        name: "Message",
                        value: guild.document.farewell.message
                            ?   "```json\n" + JSON.stringify(guild.document.farewell.message ? embeds.generateEmbed(guild.document.farewell.message) : {}) + "```"
                            :   "[Default Messages]",
                    },
                ],
                footer: {
                    text: (message.guild.channels.cache.has(guild.document.farewell.channelId) ? "Channel #" + message.guild.channels.cache.get(guild.document.farewell.channelId).name + " • " : "")
                    + (typeof guild.document.farewell.timeout === "number" && guild.document.farewell.timeout ? "Timeout - " + (guild.document.farewell.timeout + " minutes") : "No Timeout"),
                },
            },
        });
    }
}
