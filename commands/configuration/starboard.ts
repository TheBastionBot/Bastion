/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class Starboard extends Command {
    constructor() {
        super("starboard", {
            description: "It allows you to enable (and disable) Starboard in the server. It sets the channel as the Starboard Channel that will log the starred messages of the server.",
            triggers: [],
            arguments: {
                alias: {
                    disable: [ "d" ],
                },
                boolean: [ "disable" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "starboard",
                "starboard --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the starboard channel
        if (argv.disable) {
            guild.document.starboardChannelId = undefined;
            delete guild.document.starboardChannelId;
        } else {
            guild.document.starboardChannelId = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.starboardChannelId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.starboardChannelId ? "starboardEnable" : "starboardDisable", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
