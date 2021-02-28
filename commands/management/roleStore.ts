/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");
import BastionRole = require("../../structures/Role");

export = class RoleStoreCommand extends Command {
    constructor() {
        super("roleStore", {
            description: "It allows you to set up a Role Store in the server. Server managers can sell roles in the server and members can buy them with Bastion Coins.",
            triggers: [],
            arguments: {
                boolean: [ "buy", "unlist" ],
                number: [ "sell"],
                coerce: {
                    sell: (arg: number): number => numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER),
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [],
            syntax: [
                "roleStore",
                "roleStore ROLE --sell AMOUNT",
                "roleStore ROLE --buy",
                "roleStore ROLE --unlist",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv._.length) {
            // identify role
            const role = this.client.resolver.resolveRole(message.guild, argv._.join(" ")) as BastionRole;

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));


            if (argv.sell > 0) {
                // check for premium membership
                if (constants.isPublicBastion(this.client.user)) {
                    // find paid roles in the server
                    const paidRolesCount = await RoleModel.countDocuments({
                        guild: message.guild.id,
                        price: { $exists: true, $ne: null },
                    });

                    // check whether limits have exceeded
                    if (paidRolesCount >= constants.LIMITS.PAID_ROLES) {
                        // fetch the premium tier
                        const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                            // this error can be ignored
                        });

                        if (tier) { // check for premium membership limits
                            if (tier === omnic.PremiumTier.GOLD && paidRolesCount >= constants.LIMITS.GOLD.PAID_ROLES) {
                                throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitPaidRoles", constants.LIMITS.GOLD.PAID_ROLES));
                            } else if (tier === omnic.PremiumTier.PLATINUM && paidRolesCount >= constants.LIMITS.PLATINUM.PAID_ROLES) {
                                throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitPaidRoles", constants.LIMITS.PLATINUM.PAID_ROLES));
                            }
                        } else {    // no premium membership
                            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumPaidRoles", constants.LIMITS.PAID_ROLES));
                        }
                    }
                }


                // check whether the member has permission to manage roles
                if (!message.member.permissions.has("MANAGE_ROLES")) throw new Error("NO_PERMISSION");

                // set the price for the role
                await RoleModel.findOneAndUpdate({
                    _id: role.id,
                    guild: message.guild.id,
                }, {
                    _id: role.id,
                    guild: message.guild.id,
                    price: argv.sell,
                }, {
                    upsert: true,
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleStoreAdd", message.author.tag, role.name, argv.sell),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            if (argv.buy) {
                // check whether the member has this role
                if (message.member.roles.cache.has(role.id)) throw new Error("ROLE_ALREADY_ASSIGNED");

                // check whether the role is for sale
                const roleDocument = await RoleModel.findOne({
                    _id: role.id,
                    guild: message.guild.id,
                    price: { $exists: true, $ne: null },
                });

                if (!roleDocument) throw new Error("ROLE_NOT_FOR_SALE");

                // check whether the member has sufficient balance to buy the role
                if ((message.member as BastionGuildMember).document.balance < roleDocument.price) throw new Error("INSUFFICIENT_BALANCE");

                // add the role to the member
                await message.member.roles.add(role);

                // debit the price from the member's account
                (message.member as BastionGuildMember).debit(roleDocument.price, "Paid Role", (message.member as BastionGuildMember).document);

                await (message.member as BastionGuildMember).document.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleBought", message.author.tag, role.name, roleDocument.price),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            if (argv.unlist) {
                // check whether the member has permission to manage roles
                if (!message.member.permissions.has("MANAGE_ROLES")) throw new Error("NO_PERMISSION");

                // unlist the role from the role store
                await RoleModel.findOneAndUpdate({
                    _id: role.id,
                    guild: message.guild.id,
                    price: { $exists: true, $ne: null, },
                }, {
                    _id: role.id,
                    guild: message.guild.id,
                    $unset: {
                        price: 1,
                    },
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleStoreRemove", message.author.tag, role.name),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }
        }

        // get all roles for sale
        const roleDocuments = await RoleModel.find({
            guild: message.guild.id,
            price: { $exists: true, $ne: null, },
        });

        if (!roleDocuments.length) throw new Error("NO_ROLES_ON_SALE");

        // acknowledge
        return await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Roles Store",
                fields: roleDocuments.map(roleDocument => ({
                    name: (message.guild.roles.cache.has(roleDocument._id) ? message.guild.roles.cache.get(roleDocument._id).name + " / " : "") + roleDocument._id,
                    value: roleDocument.price + " Bastion Coins",
                })),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
