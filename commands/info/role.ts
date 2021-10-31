/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { GuildMember, Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as pagination from "../../utils/pagination";
import * as strings from "../../utils/strings";

import BastionGuild = require("../../structures/Guild");

export = class RoleCommand extends Command {
    constructor() {
        super("role", {
            description: "It allows you see the information of a role. It also allows you to see the members in a role.",
            triggers: [ "roleInfo" ],
            arguments: {
                alias: {
                    members: [ "m" ],
                },
                number: [ "members" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "role ROLE",
                "role ROLE --members PAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const identifier: string = argv._.join(" ");

        // identify the role
        const role = this.client.resolver.resolveRole(message.guild, identifier);

        if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

        // return the members in the role
        if (argv.members) {
            const members = pagination.paginate([ ...role.members.values() ], argv.members);


            // acknowledge
            return await message.channel.send({
                embed: {
                    color: role.color,
                    author: {
                        name: role.name,
                    },
                    title: "Role Members",
                    fields: members.items.map((member: GuildMember) => ({
                        name: member.displayName,
                        value: member.user.tag + " / " + member.id,
                    })),
                    footer: {
                        text: `Page ${members.page} of ${members.pages}`
                    },
                },
            });
        }

        // acknowledge
        return await message.channel.send({
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
        });
    };
}
