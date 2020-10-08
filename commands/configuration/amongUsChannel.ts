/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class AmongUsChannelCommand extends Command {
    constructor() {
        super("amongUsChannel", {
            description: "It allows to set the channel for creating Among Us lobbies. Anybody who has access to this channel would be able to auto create Among Us lobbies using the `amongus` command.",
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
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "amongUsChannel",
                "amongUsChannel --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the among us role
        if (argv.remove) {
            guild.document.amongUsChannel = undefined;
            delete guild.document.amongUsChannel;
        } else {
            // set the among us channel
            guild.document.amongUsChannel = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.amongUsChannel ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.amongUsChannel ? "amongUsChannelSet" : "amongUsChannelUnset", message.author.tag, (message.channel as TextChannel).name),
            },
        });
    }
}
