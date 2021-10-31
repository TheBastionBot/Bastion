/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Interrupt } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");

export = class MentionSpamInterrupt extends Interrupt {
    constructor() {
        super("mentionSpam", {
            type: 2,
        });
    }

    exec = async (message: Message): Promise<boolean> => {
        if (!message.guild) return;

        if (!(message.channel instanceof TextChannel)) return;

        if (!message.content || !message.content.length) return false;

        const guild = message.guild as BastionGuild;

        // check whether the member is in the safe list
        if (message.member && message.member.roles.cache.some(role => role.name.toLowerCase() === "safelist")) return false;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member) && message.channel.permissionsFor(message.member).has([ "MANAGE_CHANNELS", "MANAGE_MESSAGES" ])) return false;

        // check whether mention spam infractions are enabled
        if (!guild.document || !guild.document.mentionSpam || !guild.document.mentionSpam.threshold) return false;

        let filtered = false;

        // check whether the number of mentions in the messages are above the allowed threshold
        if (message.mentions.users.size > guild.document.mentionSpam.threshold) filtered = true;
        if (message.mentions.roles.size > guild.document.mentionSpam.threshold) filtered = true;

        if (filtered) {
            // add infraction
            (message.member as BastionGuildMember).addInfraction("Mention spam.");

            // create moderation log
            guild.createModerationLog({
                event: "mentionSpam",
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
        }

        return filtered;
    };
}
