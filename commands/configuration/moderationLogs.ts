/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class ModerationLogs extends Command {
    constructor() {
        super("moderationLogs", {
            description: "It allows you to enable (and disable) logging of the moderation events in the server. It sets the channel as the Moderation Log Channel that will log the moderation events in the server.",
            triggers: [ "modLogs" ],
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
                "moderationLogs",
                "moderationLogs --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the moderation logs channel
        if (argv.disable) {
            guild.document.moderationLogChannelId = undefined;
            delete guild.document.moderationLogChannelId;
        } else {
            guild.document.moderationLogChannelId = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.moderationLogChannelId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.moderationLogChannelId ? "moderationLogsEnable" : "moderationLogsDisable", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
