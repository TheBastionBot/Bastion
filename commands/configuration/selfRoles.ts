/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, EmbedFieldData } from "discord.js";

import * as errors from "../../utils/errors";

import RoleModel from "../../models/Role";

export = class SelfRoles extends Command {
    private MAX_SELF_ROLES: number;

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

        this.MAX_SELF_ROLES = 10;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (argv.add) {
            // check whether the self roles limit has been reached
            const count = await RoleModel.countDocuments({
                guild: message.guild.id,
                selfAssignable: true,
            });

            if (count >= this.MAX_SELF_ROLES) {
                throw new Error(this.client.locale.getString("en_us", "errors", "selfRolesLimit", this.MAX_SELF_ROLES));
            }

            // check whether the specified role exists
            const role = this.client.resolver.resolveRole(message.guild, argv.add.join(" "));

            if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "errors", "roleNotFound"));

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

            if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "errors", "roleNotFound"));

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
