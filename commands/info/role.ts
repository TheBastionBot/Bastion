/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import * as strings from "../../utils/strings";
import * as errors from "../../utils/errors";

export = class RoleCommand extends Command {
    constructor() {
        super("role", {
            description: "It allows you see the information of a role.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "role -- ROLE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const identifier: string = argv._.join(" ");

        // identify the role
        const role = this.client.resolver.resolveRole(message.guild, identifier);

        if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString("en_us", "errors", "roleNotFound"));

        // acknowledge
        message.channel.send({
            embed: {
                color: role.color,
                author: {
                    name: role.name,
                },
                title: (role.managed ? "Managed" : "") + " Role",
                fields: [
                    {
                        name: "Position",
                        value: (message.guild.roles.cache.size - role.rawPosition).toString(),
                        inline: true,
                    },
                    {
                        name: "Members",
                        value: role.members.size + " Members",
                        inline: true,
                    },
                    {
                        name: "Created",
                        value: role.createdAt.toUTCString(),
                        inline: true,
                    },
                    {
                        name: "Permissions",
                        value: role.permissions.bitfield ? role.permissions.toArray().map(p => strings.snakeToTitleCase(p)).join(", ") : "-",
                    },
                ],
                footer: {
                    text: (role.hoist ? "Hoisted • " : "") + role.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
