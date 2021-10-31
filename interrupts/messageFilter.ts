/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Interrupt } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");

export = class MessageFilter extends Interrupt {
    constructor() {
        super("messageFilter", {
            type: 0,
        });
    }

    private testPatterns = (message: string, patterns: string[]): boolean => {
        for (const pattern of patterns) {
            const patternRegExp = new RegExp(pattern.replace(/\?/g, ".").replace(/\*+/g, ".*"), "ig");

            if (patternRegExp.test(message)) return true;
        }
        return false;
    };

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!(message.channel instanceof TextChannel)) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member is in the safe list
        if (message.member && message.member.roles.cache.some(role => role.name.toLowerCase() === "safelist")) return false;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member) && message.channel.permissionsFor(message.member).has([ "MANAGE_CHANNELS", "MANAGE_MESSAGES" ])) return false;

        // check whether message filter is enabled
        if (!guild.document || !guild.document.filters || !guild.document.filters.messageFilter || !guild.document.filters.messageFilter.enabled || !guild.document.filters.messageFilter.patterns) return false;

        // check whether the message matches restricted patterns
        if (this.testPatterns(message.content, guild.document.filters.messageFilter.patterns)) {
            // add infraction
            (message.member as BastionGuildMember).addInfraction("Violated message filter.");

            // delete the message
            if (message.deletable) message.delete().catch(() => {
                // this error can be ignored
            });

            // create moderation log
            guild.createModerationLog({
                event: "messageFilter",
                fields: [
                    {
                        name: "User",
                        value: message.author.tag + " / " + message.author.id,
                    },
                    {
                        name: "Channel",
                        value: message.channel.name + " / " + message.channel.id,
                    },
                ],
            }).catch(() => {
                // this error can be ignored
            });

            return true;
        }

        return false;
    };
}
