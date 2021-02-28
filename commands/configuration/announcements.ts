/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class Announcements extends Command {
    constructor() {
        super("announcements", {
            description: "It allows you to enable (and disable) Bastion's Announcements in the server. It sets the channel as the Announcement Channel that will receive the announcement broadcasts sent by the bot owners using the `announce` command.",
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
                "announcements",
                "announcements --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the announcement channel
        if (argv.disable) {
            guild.document.announcementsChannelId = undefined;
            delete guild.document.announcementsChannelId;
        } else {
            guild.document.announcementsChannelId = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.announcementsChannelId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.announcementsChannelId ? "announcementsEnable" : "announcementsDisable", message.author.tag),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
