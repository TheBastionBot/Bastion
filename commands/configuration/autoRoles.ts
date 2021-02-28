/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, EmbedFieldData } from "discord.js";

import RoleModel from "../../models/Role";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");

export = class AutoRoles extends Command {
    constructor() {
        super("autoRoles", {
            description: "It allows you to set up Auto Roles in the server. Auto Roles are the roles which are assigned to users automatically when they join the server. You can optionally set up Auto Roles for either bots or humans.",
            triggers: [],
            arguments: {
                alias: {
                    add: [ "a" ],
                    remove: [ "r" ],
                    bot: [ "b" ],
                    user: [ "u" ],
                },
                array: [ "add", "remove" ],
                boolean: [ "bot", "user" ],
                string: [ "add", "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "autoRoles",
                "autoRoles --add ROLE",
                "autoRoles --add ROLE --bot",
                "autoRoles --add ROLE --user",
                "autoRoles --remove ROLE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (argv.add) {
            // check for premium membership limits
            if (constants.isPublicBastion(this.client.user)) {
                // find auto roles in the server
                const autoRolesCount = await RoleModel.countDocuments({
                    guild: message.guild.id,
                    autoAssignable: { $exists: true, $ne: null },
                });

                // check whether limits have exceeded
                if (autoRolesCount >= constants.LIMITS.AUTO_ROLES) {
                    // fetch the premium tier
                    const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                        // this error can be ignored
                    });

                    if (tier) { // check for premium membership limits
                        if (tier === omnic.PremiumTier.GOLD && autoRolesCount >= constants.LIMITS.GOLD.AUTO_ROLES) {
                            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitAutoRoles", constants.LIMITS.GOLD.AUTO_ROLES));
                        } else if (tier === omnic.PremiumTier.PLATINUM && autoRolesCount >= constants.LIMITS.PLATINUM.AUTO_ROLES) {
                            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitAutoRoles", constants.LIMITS.PLATINUM.AUTO_ROLES));
                        }
                    } else {    // no premium membership
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumAutoRoles", constants.LIMITS.AUTO_ROLES));
                    }
                }
            }


            // check whether the specified role exists
            const role = this.client.resolver.resolveRole(message.guild, argv.add.join(" "));

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            const forBots: boolean = !(Number(argv.bot) ^ Number(argv.user)) || argv.bot || false;
            const forUsers: boolean = !(Number(argv.bot) ^ Number(argv.user)) || argv.user || false;

            // set role as auto assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                _id: role.id,
                guild: message.guild.id,
                autoAssignable: {
                    forBots,
                    forUsers,
                },
            }, {
                upsert: true,
            });

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "autoRolesAdd", message.author.tag, role.name),
                    fields: [
                        {
                            name: "For Bots",
                            value: forBots.toString().toUpperCase(),
                            inline: true,
                        },
                        {
                            name: "For Humans",
                            value: forUsers.toString().toUpperCase(),
                            inline: true,
                        },
                    ],
                    footer: {
                        text: role.id,
                    },
                },
            }).catch(() => {
                // this error can be ignored
            });
        } else if (argv.remove) {
            const role = this.client.resolver.resolveRole(message.guild, argv.remove.join(" "));

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            // unset role as auto assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                $unset: {
                    autoAssignable: 1,
                },
            });

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "autoRolesRemove", message.author.tag, role.name),
                    footer: {
                        text: role.id,
                    },
                },
            }).catch(() => {
                // this error can be ignored
            });
        } else {
            const autoRoles = await RoleModel.find({
                guild: message.guild.id,
                autoAssignable: {
                    $exists: true,
                },
            });

            if (!autoRoles.length) {
                throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "noAutoRoles"));
            }

            // construct list of auto roles
            const fields: EmbedFieldData[] = [];

            for (const role of autoRoles) {
                // delete the role if it doesn't exist
                if (!message.guild.roles.cache.has(role._id)) {
                    await role.remove().catch(() => {
                        // this error can be ignored
                    });
                }

                fields.push({
                    name: message.guild.roles.cache.get(role._id).name || "-",
                    value: role._id
                        + (Number(role.autoAssignable.forBots) ^ Number(role.autoAssignable.forUsers) && role.autoAssignable.forBots ? " / BOTS" : "")
                        + (Number(role.autoAssignable.forBots) ^ Number(role.autoAssignable.forUsers) && role.autoAssignable.forUsers ? " / HUMANS" : "")
                });
            }

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    title: "Auto Roles",
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "autoRolesList"),
                    fields,
                },
            }).catch(() => {
                // this error can be ignored
            });
        }
    }
}
