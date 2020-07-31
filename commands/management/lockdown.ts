/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { GuildChannel, Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class LockdownCommand extends Command {
    constructor() {
        super("lockdown", {
            description: "It allows you lockdown a channel in the server from users who don't have permission to manage messages or the channel.",
            triggers: [],
            arguments: {
                alias: {
                    remove: [ "r" ],
                },
                boolean: [ "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_CHANNELS" ],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "lockdown",
                "lockdown --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        for (const permissionOverwrite of (message.channel as GuildChannel).permissionOverwrites.values()) {
            // check whether the overwrite has permission to manage messages or the channel

            if (permissionOverwrite.allow.has("MANAGE_MESSAGES") || permissionOverwrite.allow.has("MANAGE_CHANNELS")) continue;

            // deny permission to send messages in the channel
            permissionOverwrite.update({
                SEND_MESSAGES: argv.remove ? null : false,
            });
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.remove ? Constants.COLORS.GREEN : Constants.COLORS.ORANGE,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.remove ? "lockdownChannelRemove" : "lockdownChannel", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
