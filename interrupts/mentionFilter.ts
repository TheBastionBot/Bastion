/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Interrupt } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../structures/Guild");

export = class MessageMention extends Interrupt {
    constructor() {
        super("messageMention");
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member has permission to manage messages
        if (message.member.hasPermission("MANAGE_MESSAGES")) return false;

        // check whether mention filter is enabled
        if (!guild.document.filters || !guild.document.filters.mentionFilter || !guild.document.filters.mentionFilter.enabled || !guild.document.filters.mentionFilter.threshold) return false;

        // check whether the number of mentions in the messages are above the allowed threshold
        if (message.mentions.users.size > guild.document.filters.mentionFilter.threshold) return true;
        if (message.mentions.roles.size > guild.document.filters.mentionFilter.threshold) return true;

        return false;
    }
}
