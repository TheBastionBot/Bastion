/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import confirmation from "../../utils/confirmation";

export = class RolesCommand extends Command {
    constructor() {
        super("roles", {
            description: "It allows you create, delete and update roles in the server.",
            triggers: [],
            arguments: {
                array: [ "create", "delete", "name", "rename" ],
                boolean: [ "hoist", "mentionable" ],
                string: [ "create", "delete", "rename" ],
                coerce: {
                    color: Constants.ArgumentTypes.COLOR,
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "roles --create NAME -- REASON",
                "roles --create NAME --color COLOR -- REASON",
                "roles --create NAME --hoist -- REASON",
                "roles --create NAME --mentionable -- REASON",
                "roles --rename ROLE --name NAME -- REASON",
                "roles --delete ROLE -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const reason = argv._.join(" ") || "-";

        if (argv.create && argv.create.length) {
            // create the role
            const role = await message.guild.roles.create({
                data: {
                    name: argv.create.join(" "),
                    color: argv.color,
                    hoist: argv.hoist,
                    mentionable: argv.mentionable,
                },
                reason,
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "roleCreate", message.author.tag, role.name, reason),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        if (argv.delete && argv.delete.length) {
            // find the role
            const role = this.client.resolver.resolveRole(message.guild, argv.delete.join(" "));

            // get confirmation
            const answer = await confirmation(message, this.client.locale.getString("en_us", "info", "roleDeleteQuestion", message.author.tag, role.name));

            if (answer) {
                // delete role
                await role.delete(reason);

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString("en_us", "info", "roleDelete", message.author.tag, role.name, reason),
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            return true;
        }

        if (argv.rename && argv.rename.length && argv.name && argv.name.length) {
            // find the role
            let role = this.client.resolver.resolveRole(message.guild, argv.rename.join(" "));

            // rename the role
            role = await role.edit({
                name: argv.name.join(" "),
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "roleRename", message.author.tag, role.name, reason),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);
    }
}
