/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Interrupt } from "tesseract";
import { Message, TextChannel } from "discord.js";

import BastionGuild = require("../structures/Guild");

import * as regex from "../utils/regex";

export = class LinkFilter extends Interrupt {
    constructor() {
        super("linkFilter");
    }

    private deleteLink = (message: Message): void => {
        // delete the message
        if (message.deletable) message.delete().catch(() => {
            // this error can be ignored
        });
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!(message.channel instanceof TextChannel)) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member).has([ "MANAGE_CHANNELS", "MANAGE_MESSAGES" ])) return false;

        // check whether link filter is enabled
        if (!guild.document.filters || !guild.document.filters.linkFilter || !guild.document.filters.linkFilter.enabled) return false;

        // check whether any whitelist exists
        if (guild.document.filters.linkFilter.whitelist) {
            // check whether the channel is whitelisted
            if (guild.document.filters.linkFilter.whitelist.includes(message.channel.id)) return false;

            // check whether any of the member's roles are whitelisted
            if (guild.document.filters.linkFilter.whitelist.some(id => message.member.roles.cache.has(id))) return false;
        }

        // check whether the message has an uri
        if (regex.URI.test(message.content)) {
            this.deleteLink(message);
            return true;
        }

        return false;
    }
}
