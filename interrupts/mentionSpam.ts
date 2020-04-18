/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Interrupt } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../structures/Guild");

export = class MentionSpamInterrupt extends Interrupt {
    constructor() {
        super("mentionSpam");
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member has permission to manage messages
        if (message.member.hasPermission("MANAGE_MESSAGES")) return false;

        // check whether mention spam infractions are enabled
        if (!guild.document.mentionSpam || !guild.document.mentionSpam.threshold) return false;

        // check whether the number of mentions in the messages are above the allowed threshold
        if (message.mentions.users.size > guild.document.mentionSpam.threshold) return true;
        if (message.mentions.roles.size > guild.document.mentionSpam.threshold) return true;

        return false;
    }
}
