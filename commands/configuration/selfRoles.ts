/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, EmbedFieldData } from "discord.js";

import RoleModel from "../../models/Role";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";


export = class SelfRoles extends Command {
    constructor() {
        super("selfRoles", {
            description: "It allows you to set up Self Roles in the server. Self Roles are the roles which server members can assign (and unassign) to themselves.",
            triggers: [],
            arguments: {
                alias: {
                    add: [ "a" ],
                    remove: [ "r" ],
                },
                array: [ "add", "remove" ],
                string: [ "add", "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "selfRoles",
                "selfRoles --add ROLE",
                "selfRoles --remove ROLE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (argv.add) {
            // check for premium membership
            if (constants.isPublicBastion(this.client.user)) {
                // find self roles in the server
                const selfRolesCount = await RoleModel.countDocuments({
                    guild: message.guild.id,
                    selfAssignable: true,
                });

                if (selfRolesCount >= 5 && !await omnic.isPremiumGuild(message.guild)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString("en_us", "errors", "premiumSelfRoles", 5));
            }


            // check whether the specified role exists
            const role = this.client.resolver.resolveRole(message.guild, argv.add.join(" "));

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString("en_us", "errors", "roleNotFound"));

            // set role as self assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                _id: role.id,
                guild: message.guild.id,
                selfAssignable: true,
            }, {
                upsert: true,
            });

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "selfRolesAdd", message.author.tag, role.name),
                    footer: {
                        text: role.id,
                    },
                },
            }).catch(() => {
                // this error can be ignored
            });
        } else if (argv.remove) {
            const role = this.client.resolver.resolveRole(message.guild, argv.remove.join(" "));

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString("en_us", "errors", "roleNotFound"));

            // unset role as self assignable
            await RoleModel.findByIdAndUpdate(role.id, {
                $unset: {
                    selfAssignable: 1,
                },
            });

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "info", "selfRolesRemove", message.author.tag, role.name),
                    footer: {
                        text: role.id,
                    },
                },
            }).catch(() => {
                // this error can be ignored
            });
        } else {
            const selfRoles = await RoleModel.find({
                guild: message.guild.id,
                selfAssignable: true,
            });

            if (!selfRoles.length) {
                throw new Error(this.client.locale.getString("en_us", "errors", "noSelfRoles"));
            }

            // construct list of self roles
            const fields: EmbedFieldData[] = [];

            for (const role of selfRoles) {
                // delete the role if it doesn't exist
                if (!message.guild.roles.cache.has(role._id)) {
                    await role.remove().catch(() => {
                        // this error can be ignored
                    });
                }

                fields.push({
                    name: message.guild.roles.cache.get(role._id).name || "-",
                    value: role._id
                });
            }

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    title: "Self Roles",
                    description: this.client.locale.getString("en_us", "info", "selfRolesList"),
                    fields,
                },
            }).catch(() => {
                // this error can be ignored
            });
        }
    }
}
