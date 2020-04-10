/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as arrays from "../../utils/arrays";
import * as errors from "../../utils/errors";

import BastionGuildMember = require("../../structures/GuildMember");

export = class UpdateRoles extends Command {
    constructor() {
        super("updateRoles", {
            description: "It allows you to update roles of server members.",
            triggers: [],
            arguments: {
                alias: {
                    add: "a",
                    remove: "r",
                    user: "u",
                },
                array: [ "add", "remove" ],
                boolean: [ "removeAll" ],
                string: [ "add", "remove", "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "updateRoles --user USER_ID --add ROLE_ID",
                "updateRoles --user USER_ID --remove ROLE_ID",
                "updateRoles --user USER_ID --remove-all",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // Resolve member
        const member = this.client.resolver.resolveGuildMember(message.guild, argv.user);

        // Resolve roles
        let rolesToAdd = this.client.resolver.resolveRoles(message.guild, argv.add);
        let rolesToRemove = this.client.resolver.resolveRoles(message.guild, argv.remove);

        // Command Syntax Validation
        if (!member || (!rolesToAdd.length && !rolesToRemove.length)) throw new errors.CommandSyntaxError(this.name);

        // Check command user's permission over target member
        if (message.author.id !== message.guild.ownerID && (message.member as BastionGuildMember).canManage(member)) {
            rolesToAdd = rolesToAdd.filter(r => message.member.roles.highest.comparePositionTo(r) > 0);
            rolesToRemove = rolesToRemove.filter(r => message.member.roles.highest.comparePositionTo(r) > 0);

            if ((!rolesToAdd.length && !rolesToRemove.length)) {
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        title: this.client.locale.getString("en_us", "errors", "unauthorized"),
                        description: this.client.locale.getString("en_us", "errors", "rolePosition", message.author.tag, member.user.tag),
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            }
        }

        // Update member roles
        const reason = argv._.join(" ") || "-";

        if (rolesToAdd.length) await member.roles.add(rolesToAdd, reason);
        if (argv.removeAll) await member.roles.set([], reason);
        else if (rolesToRemove.length) await member.roles.remove(rolesToRemove, reason);

        // Acknowledgement
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: this.client.locale.getString("en_us", "info", "memberRoleUpdate", message.author.tag, member.user.tag),
                fields: [
                    {
                        name: "Role Changes",
                        value: "```diff\n"
                            + arrays.toBulletList(rolesToAdd.map(r => r.name), "+")
                            + arrays.toBulletList(rolesToRemove.map(r => r.name), "-")
                            + "```",
                    },
                    {
                        name: "Reason",
                        value: reason,
                    },
                ],
                footer: {
                    text: member.id,
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
