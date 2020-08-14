/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import * as pagination from "../../utils/pagination";

export = class ReferralsCommand extends Command {
    constructor() {
        super("referrals", {
            description: "It allows you track the server members' invites.",
            triggers: [],
            arguments: {
                alias: {
                    page: [ "p" ],
                },
                number: [ "page" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_GUILD" ],
            userPermissions: [],
            syntax: [
                "referrals",
                "referrals --page NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const members = await MemberModel.find({
            guild: message.guild.id,
            referral: {
                $exists: true,
            },
        });

        const invites = await message.guild.fetchInvites();

        // paginate output
        const paginatedMembers = pagination.paginate(members.filter(m => m.referral && Array.from(invites.keys()).includes(m.referral)).map(member => ({
            name: message.guild.members.cache.has(member.user) ? message.guild.members.cache.get(member.user).user.tag : member.user,
            value: member.referral + " - " + invites.get(member.referral).uses + " Uses",
        })), argv.page);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Referrals",
                fields: paginatedMembers.items,
                footer: {
                    text: `Page ${paginatedMembers.page} of ${paginatedMembers.pages}`
                },
            },
        });
    }
}
