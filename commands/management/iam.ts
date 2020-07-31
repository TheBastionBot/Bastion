/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class IAmCommand extends Command {
    constructor() {
        super("iam", {
            description: "It allows you add (and remove) yourself to (and from) the Self Roles set in the server.",
            triggers: [],
            arguments: {
                alias: {
                    not: [ "n" ],
                },
                boolean: [ "not" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "iam ROLE",
                "iam --not ROLE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const role = this.client.resolver.resolveRole(message.guild, argv._.join(" "));

        if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

        const roleDocument = await RoleModel.findById(role.id);

        if (!roleDocument || !roleDocument.selfAssignable) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotSelfAssignable", role.name));

        if (argv.not) {
            // remove the role
            await message.member.roles.remove(role);
        } else {
            // add the role
            await message.member.roles.add(role);
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.not ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.not ? "selfRemoveRole" : "selfAddRole", message.author.tag, role.name),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
