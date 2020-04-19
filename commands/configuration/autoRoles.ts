/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, EmbedFieldData } from "discord.js";

import * as errors from "../../utils/errors";

import RoleModel from "../../models/Role";

export = class AutoRoles extends Command {
    private MAX_AUTO_ROLES: number;

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
            typing: true,
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

        this.MAX_AUTO_ROLES = 10;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (argv.add) {
            // check whether the auto roles limit has been reached
            const count = await RoleModel.countDocuments({
                guild: message.guild.id,
                autoAssignable: {
                    $exists: true,
                },
            });

            if (count >= this.MAX_AUTO_ROLES) {
                throw new Error(this.client.locale.getString("en_us", "errors", "autoRolesLimit", this.MAX_AUTO_ROLES));
            }

            // check whether the specified role exists
            const role = this.client.resolver.resolveRole(message.guild, argv.add.join(" "));

            if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "errors", "roleNotFound"));

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
                    description: this.client.locale.getString("en_us", "info", "autoRolesAdd", message.author.tag, role.name),
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
            const role =this.client.resolver.resolveRole(message.guild, argv.remove.join(" "));

            if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "errors", "roleNotFound"));

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
                    description: this.client.locale.getString("en_us", "info", "autoRolesRemove", message.author.tag, role.name),
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
                throw new Error(this.client.locale.getString("en_us", "errors", "noAutoRoles"));
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
                    description: this.client.locale.getString("en_us", "info", "autoRolesList"),
                    fields,
                },
            }).catch(() => {
                // this error can be ignored
            });
        }
    }
}
