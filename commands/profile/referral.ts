/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import RoleModel from "../../models/Role";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class ReferralCommand extends Command {
    constructor() {
        super("referral", {
            description: "It allows you to see your referral invite that you can use to invite people to the server and increase your referral points. It can also be used to claim your referral rewards set by the server managers.",
            triggers: [],
            arguments: {
                boolean: [ "claim" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "referral",
                "referral --claim",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // get the member document
        const memberDocument = await MemberModel.findOne({
            user: message.author.id,
            guild: message.guild.id,
        });

        let invite: { code: string; uses: number; url: string; };

        // check whether there's an assigned referral invite for the member
        if (memberDocument.referral) {
            const invites = await message.guild.fetchInvites();
            invite = invites.get(memberDocument.referral);
        }

        // check whether the member's referral invite exists
        if (!invite) {
            const channel = message.guild.channels.cache.get((message.guild as BastionGuild).document.referralsChannel);

            if (!channel) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "noReferralsChannel"));

            // create new referral invite
            invite = await channel.createInvite({
                reason: "Referral invite generated for " + message.author.tag,
                temporary: false,
                maxAge: 0,
                maxUses: 0,
                unique: true,
            });

            // save the referral invite in member document
            memberDocument.referral = invite.code;

            // save document
            await memberDocument.save();
        }

        if (argv.claim) {
            // get all referral reward roles
            const roles = await RoleModel.find({
                guild: message.guild.id,
                referrals: { $lte: invite.uses },
            });

            // check whether there are any rewards for the invite's uses
            if (!roles.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "noReferralRewards", invite.uses));

            // assign the reward roles to the member
            await message.member.roles.add(roles.map(r => r.id));

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    title: "Referral Reward Claimed",
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "referralRewardsClaim", message.author.tag, invite.uses),
                },
            });
        } else {
            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    title: "Referral Invite",
                    description: invite.url,
                    fields: [
                        {
                            name: "Code",
                            value: invite.code,
                            inline: true,
                        },
                        {
                            name: "Uses",
                            value: (invite.uses || 0).toLocaleString(),
                            inline: true,
                        },
                    ],
                },
            });
        }
    };
}
