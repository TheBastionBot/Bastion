/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Interrupt } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";


import * as regex from "../utils/regex";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");

export = class InviteFilter extends Interrupt {
    constructor() {
        super("inviteFilter", {
            type: 0,
        });
    }

    private deleteInvite = (message: Message): void => {
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

        // check whether the member is in the safe list
        if (message.member && message.member.roles.cache.some(role => role.name.toLowerCase() === "safelist")) return false;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member) && message.channel.permissionsFor(message.member).has([ "MANAGE_CHANNELS", "MANAGE_MESSAGES" ])) return false;

        // check whether invite filter is enabled
        if (!guild.document || !guild.document.filters || !guild.document.filters.inviteFilter || !guild.document.filters.inviteFilter.enabled) return false;

        // check whether any whitelist exists
        if (guild.document.filters.inviteFilter.whitelist) {
            // check whether the channel is whitelisted
            if (guild.document.filters.inviteFilter.whitelist.includes(message.channel.id)) return false;

            // check whether any of the member's roles are whitelisted
            if (guild.document.filters.inviteFilter.whitelist.some(id => message.member.roles.cache.has(id))) return false;
        }

        // check whether the message has invite
        if (regex.SERVER_INVITE.test(message.content)) {
            // allowed invite codes
            const allowed: string[] = [];

            // fetch guild invite codes
            const guildInvites = await message.guild.fetchInvites().catch(() => {
                // this error can be ignored
            });
            if (guildInvites) allowed.push(...guildInvites.keys());

            // fetch guild vanity code
            const vanityData = await message.guild.fetchVanityData().catch(() => {
                // this error can be ignored
            });
            if (vanityData && vanityData.code) allowed.push(vanityData.code);

            // extract invite codes in messages
            const invites = message.content.match(new RegExp(regex.SERVER_INVITE, "g"));

            if (allowed.length && invites.every(code => allowed.includes(code))) return false;

            // add infraction
            (message.member as BastionGuildMember).addInfraction("Unauthorized to send Server Invites.");

            // delete invite code
            this.deleteInvite(message);

            // create moderation log
            guild.createModerationLog({
                event: "inviteFilter",
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
    }
}
