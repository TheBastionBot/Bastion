/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class ServerLogs extends Command {
    constructor() {
        super("serverLogs", {
            description: "It allows you to enable (and disable) logging of the server events. It sets the channel as the Server Log Channel that will log the server events.",
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
                "serverLogs",
                "serverLogs --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the server logs channel
        if (argv.disable) {
            guild.document.serverLogChannelId = undefined;
            delete guild.document.serverLogChannelId;
        } else {
            guild.document.serverLogChannelId = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.serverLogChannelId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.serverLogChannelId ? "serverLogsEnable" : "serverLogsDisable", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
