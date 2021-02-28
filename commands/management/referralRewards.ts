/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { EmbedFieldData, Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";
import * as omnic from "../../utils/omnic";
import * as pagination from "../../utils/pagination";
import BastionGuild = require("../../structures/Guild");
import BastionRole = require("../../structures/Role");

export = class ReferralRewardsCommand extends Command {
    constructor() {
        super("referralRewards", {
            description: "It allows you set roles as rewards for referrals (inviting other users to the server).",
            triggers: [],
            arguments: {
                alias: {
                    referrals: [ "n" ],
                    page: [ "p" ],
                },
                array: [ "role" ],
                boolean: [ "remove" ],
                string: [ "role" ],
                number: [ "referrals", "page" ],
                coerce: {
                    referrals: (arg: number): number => numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER),
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_GUILD" ],
            userPermissions: [],
            syntax: [
                "referralRewards",
                "referralRewards --page NUMBER",
                "referralRewards -n NUMBER --role ROLE",
                "referralRewards -n NUMBER --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.referrals) {
            if (argv.role) {
                // check for premium membership
                if (constants.isPublicBastion(this.client.user)) {
                    // fetch the premium tier
                    const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                        // this error can be ignored
                    });


                    // count role referrals
                    const roleReferralsCount = await RoleModel.countDocuments({
                        guild: message.guild.id,
                        referrals: { $exists: true, $ne: null },
                    });


                    if (tier) { // check for premium membership limits
                        if (tier === omnic.PremiumTier.GOLD && roleReferralsCount >= constants.LIMITS.GOLD.INVITE_REWARDS) {
                            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitInviteRoles", constants.LIMITS.GOLD.INVITE_REWARDS));
                        } else if (tier === omnic.PremiumTier.PLATINUM && roleReferralsCount >= constants.LIMITS.PLATINUM.INVITE_REWARDS) {
                            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitInviteRoles", constants.LIMITS.PLATINUM.INVITE_REWARDS));
                        }
                    } else if (roleReferralsCount >= constants.LIMITS.INVITE_REWARDS) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumInviteRoles", constants.LIMITS.INVITE_REWARDS));
                    }
                }


                const role = this.client.resolver.resolveRole(message.guild, argv.role.join(" ")) as BastionRole;

                if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

                // get the role document if it exists
                let roleDocument = await role.fetchDocument();

                // otherwise, create the document if required
                if (!roleDocument) {
                    roleDocument = await role.createDocument();
                }

                // set role's referrals count
                roleDocument.referrals = argv.referrals;

                // save document
                await roleDocument.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleReferralsSet", message.author.tag, role.name, argv.referrals),
                    },
                });
            }

            if (argv.remove) {
                // remove the referrals amount from roles
                await RoleModel.updateMany({
                    guild: message.guild.id,
                    referrals: argv.referrals,
                }, {
                    $unset: {
                        referrals: 1,
                    },
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleReferralsClear", message.author.tag, argv.referrals),
                    },
                });
            }
        }

        // get all referral reward roles
        const roles = await RoleModel.find({
            guild: message.guild.id,
            referrals: { $exists: true, $ne: null, },
        });

        if (!roles.length) throw new Error("NO_REFERRAL_REWARDS");

        // segregate roles by referral count
        const rewardRoles: { [referrals: string ]: string[] } = {};
        for (const role of roles) {
            if (role.referrals in rewardRoles) {
                rewardRoles[role.referrals].push(role.id);
            } else {
                rewardRoles[role.referrals] = [ role.id ];
            }
        }

        // paginate output
        const rewards = pagination.paginate(Object.keys(rewardRoles).map(referrals => ({
            name: referrals + " Referrals",
            value: rewardRoles[referrals].map(id => message.guild.roles.cache.has(id) ? message.guild.roles.cache.get(id).name : id).join(", "),
        })), argv.page);

        // acknowledge
        return await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Referral Rewards",
                fields: rewards.items as EmbedFieldData[],
                footer: {
                    text: `Page ${rewards.page} of ${rewards.pages}`
                },
            },
        });
    }
}
