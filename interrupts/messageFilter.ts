/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Interrupt } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../structures/Guild");

export = class MessageFilter extends Interrupt {
    constructor() {
        super("messageFilter");
    }

    private testPatterns = (message: string, patterns: string[]): boolean => {
        for (const pattern of patterns) {
            const patternRegExp = new RegExp(pattern.replace(/\?/g, ".").replace(/\*+/g, ".*"), "ig");

            if (patternRegExp.test(message)) return true;
        }
        return false;
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member has permission to manage messages
        if (message.member.hasPermission("MANAGE_MESSAGES")) return false;

        // check whether message filter is enabled
        if (!guild.document.filters || !guild.document.filters.messageFilter || !guild.document.filters.messageFilter.enabled || !guild.document.filters.messageFilter.patterns) return false;

        // check whether the message matches restricted patterns
        if (this.testPatterns(message.content, guild.document.filters.messageFilter.patterns)) {
            // delete the message
            if (message.deletable) message.delete().catch(() => {
                // this error can be ignored
            });

            return true;
        }

        return false;
    }
}
