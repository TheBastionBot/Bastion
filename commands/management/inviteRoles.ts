/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class InviteRolesCommand extends Command {
    constructor() {
        super("inviteRoles", {
            description: "It allows you to associate server invites with roles. Anyone who joins the server with an invite associated with a role will be assigned the specified role automatically. It also allows you to see the list of roles associated with an invite.",
            triggers: [],
            arguments: {
                boolean: [ "delete" ],
                string: [ "invite", "role" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "inviteRoles",
                "inviteRoles --role ROLE --invite CODE",
                "inviteRoles --role ROLE --delete",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.role) {
            // check whether the specified role exists
            const role = this.client.resolver.resolveRole(message.guild, argv.role);

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            if (argv.invite) {
                // set invite code
                await RoleModel.findByIdAndUpdate(role.id, {
                    invite: argv.invite.split("/").filter((w: string) => w).pop(),
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleInviteSet", message.author.tag, role.name, argv.invite),
                    },
                });
            }

            if (argv.delete) {
                // unset invite code
                await RoleModel.findByIdAndUpdate(role.id, {
                    $unset: {
                        invite: 1,
                    },
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "roleInviteRemove", message.author.tag, role.name),
                    },
                });
            }
        }

        // get all the invite roles
        const roleDocuments = await RoleModel.find({
            guild: message.guild.id,
            invite: {
                $exists: true,
                $ne: null,
            },
        });

        if (!roleDocuments) throw new Error("NO_INVITE_ROLES");


        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Invite Roles",
                fields: roleDocuments.map(role => ({
                    name: (message.guild.roles.cache.has(role._id) ? message.guild.roles.cache.get(role._id).name : "[DELETED]") + " / " + role._id,
                    value: "Invite Code - " + role.invite,
                })),
            },
        });
    }
}
