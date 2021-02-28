/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Interrupt } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import BastionGuild = require("../structures/Guild");

export = class MembersOnlyInterrupt extends Interrupt {
    constructor() {
        super("membersOnly", {
            type: 3,
        });
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!(message.channel instanceof TextChannel)) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether members only mode is enabled
        if (!guild.document || !guild.document.membersOnly) return false;

        // check whether the member has at least one role
        if (message.member && message.guild.ownerID !== message.member.id && message.member.roles.cache.size < 2) return true;

        return false;
    }
}
