/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class MembersOnlyCommand extends Command {
    constructor() {
        super("membersOnly", {
            description: "It allows you to enable (and disable) Members Only mode in the server. If enabled, only the members who have at least one role in the server can use Bastion.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the announcement channel
        if (guild.document.membersOnly) {
            guild.document.membersOnly = undefined;
            delete guild.document.membersOnly;
        } else {
            guild.document.membersOnly = true;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.membersOnly ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.membersOnly ? "membersOnlyEnable" : "membersOnlyDisable", message.author.tag),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    };
}
