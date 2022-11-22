/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Filter, Logger } from "@bastion/tesseract";
import { Message, PermissionFlagsBits } from "discord.js";

import GuildModel from "../models/Guild";
import { logModerationEvent } from "../utils/guilds";
import { addInfraction } from "../utils/members";
import * as regex from "../utils/regex";

class InviteFilter extends Filter {
    constructor() {
        super("invites");
    }

    public async exec(message: Message<boolean>): Promise<boolean> {
        if (!message.inGuild()) return;
        if (!message.content?.length) return;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member)?.has(PermissionFlagsBits.ManageMessages)) return false;

        const guildDocument = await GuildModel.findById(message.guildId);

        // check whether invite filter is enabled
        if (!guildDocument?.inviteFilter) return false;

        // check whether any whitelist exists
        if (guildDocument.inviteFilterExemptions?.length) {
            // check whether the channel is whitelisted
            if (guildDocument.inviteFilterExemptions.includes(message.channel.id)) return false;

            // check whether any of the member's roles are whitelisted
            if (guildDocument.inviteFilterExemptions.some(id => message.member.roles.cache.has(id))) return false;
        }

        // check whether the message has an invite
        if (regex.SERVER_INVITE.test(message.content)) {
            // allowed invite codes
            const allowed: string[] = [];

            // fetch guild invite codes
            await message.guild.invites.fetch().catch(Logger.ignore);
            allowed.push(...message.guild.invites.cache.keys());

            // fetch guild vanity code
            const vanityData = await message.guild.fetchVanityData().catch(Logger.ignore);
            if (vanityData) allowed.push(vanityData.code);

            // extract invite codes in messages
            const invites = message.content.match(new RegExp(regex.SERVER_INVITE, "ig"));

            if (allowed.length && invites?.every(link => allowed.includes(link?.split("/")?.pop()))) return false;

            // add infraction
            addInfraction(message.member, "Invite Filter").catch(Logger.error);

            // create moderation log
            logModerationEvent(message.guild, {
                title: "Invite Filtered",
                fields: [
                    {
                        name: "User",
                        value: message.author.tag,
                    },
                    {
                        name: "ID",
                        value: message.author.id,
                    },
                    {
                        name: "Channel",
                        value: message.channel.toString(),
                    },
                ],
            }).catch(Logger.ignore);

            return true;
        }

        return false;
    }
}

export = InviteFilter;
