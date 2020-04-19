/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as errors from "../../utils/errors";
import * as gamification from "../../utils/gamification";
import * as numbers from "../../utils/numbers";

import BastionRole = require("../../structures/Role");

export = class LevelUpRolesCommand extends Command {
    constructor() {
        super("levelUpRoles", {
            description: "It allows you to add roles to a level so that when members reach.",
            triggers: [],
            arguments: {
                array: [ "role" ],
                boolean: [ "remove" ],
                string: [ "role" ],
                number: [ "level"],
                coerce: {
                    level: (arg: number): number => numbers.clamp(arg, 1, gamification.MAX_LEVEL),
                },
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "levelUpRoles",
                "levelUpRoles --level NUMBER",
                "levelUpRoles --level NUMBER --role ROLE",
                "levelUpRoles --level NUMBER --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.level) {
            if (argv.role) {
                const role = this.client.resolver.resolveRole(message.guild, argv.role.join(" ")) as BastionRole;

                if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "info", "roleNotFound"));

                // get the role document if it exists
                let roleDocument = await role.fetchDocument();

                // otherwise, create the document if required
                if (!roleDocument && argv.emoji) {
                    roleDocument = await role.createDocument();
                }

                // set role's level
                roleDocument.level = argv.level;

                // save document
                await roleDocument.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString("en_us", "info", "roleLevelAdd", message.author.tag, role.name, argv.level),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            if (argv.remove) {
                // remove the level from roles
                await RoleModel.updateMany({
                    guild: message.guild.id,
                    level: argv.level,
                }, {
                    level: undefined,
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        description: this.client.locale.getString("en_us", "info", "roleLevelClear", message.author.tag, argv.level),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            // get roles for the level
            const roles = await RoleModel.find({
                guild: message.guild.id,
                level: argv.level,
            });

            if (!roles.length) throw new Error("NO_ROLES_FOR_LEVEL");

            // identify the roles
            const levelRoles = this.client.resolver.resolveRoles(message.guild, roles.map(r => r._id));

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    title: "Level " + argv.level,
                    fields: [
                        {
                            name: "Roles",
                            value: levelRoles.map(r => r.name).join("\n"),
                        }
                    ],
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // get all level up roles
        const roles = await RoleModel.find({
            guild: message.guild.id,
            level: { $exists: true, $ne: null, },
        });

        if (!roles.length) throw new Error("NO_LEVEL_UP_ROLES");

        // segregate roles into levels
        const levelRoles: { [level: string ]: string[] } = {};
        for (const role of roles) {
            if (role.level in levelRoles) {
                levelRoles[role.level].push(role._id);
            } else {
                levelRoles[role.level] = [ role._id ];
            }
        }

        // acknowledge
        return await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Level-Up Roles",
                fields: Object.keys(levelRoles).map(level => ({
                    name: "Level " + level,
                    value: levelRoles[level].map(id => message.guild.roles.cache.has(id) ? message.guild.roles.cache.get(id).name : id).join(", "),
                })),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}