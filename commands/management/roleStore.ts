/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";
import * as omnic from "../../utils/omnic";

import BastionRole = require("../../structures/Role");
import BastionGuildMember = require("../../structures/GuildMember");

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

            if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "error", "roleNotFound"));


            if (argv.sell > 0) {
                // check for premium membership
                if (constants.isPublicBastion(this.client.user)) {
                    // find paid roles in the server
                    const paidRolesCount = await RoleModel.countDocuments({
                        guild: message.guild.id,
                        price: { $exists: true, $ne: null },
                    });

                    if (paidRolesCount >= 5 && !await omnic.isPremiumGuild(message.guild)) throw new errors.PremiumMembershipError(this.client.locale.getString("en_us", "errors", "premiumPaidRoles", 5));
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
                        description: this.client.locale.getString("en_us", "info", "roleStoreAdd", message.author.tag, role.name, argv.sell),
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

                // deduct the balance from the member
                (message.member as BastionGuildMember).document.balance -= roleDocument.price;
                await (message.member as BastionGuildMember).document.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString("en_us", "info", "roleBought", message.author.tag, role.name, argv.sell),
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
                        description: this.client.locale.getString("en_us", "info", "roleStoreRemove", message.author.tag, role.name),
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
