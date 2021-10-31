/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, Role } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class StreamerRoleCommand extends Command {
    constructor() {
        super("streamerRole", {
            description: "It allows to set the Streamer Role for the server. When a member goes live in the server, they're assigned to this role, provided they have at least one role in the server.",
            triggers: [],
            arguments: {
                alias: {
                    remove: [ "r" ],
                },
                boolean: [ "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "streamerRole ROLE",
                "streamerRole --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length && !argv.remove) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const guild = (message.guild as BastionGuild);

        let role: Role;
        // update the streamer role
        if (argv.remove) {
            guild.document.streamerRoleId = undefined;
            delete guild.document.streamerRoleId;
        } else {
            // identify the role
            role = this.client.resolver.resolveRole(message.guild, argv._.join(" "));
            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            // set the streamer role
            guild.document.streamerRoleId = role.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.streamerRoleId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.streamerRoleId ? "streamerRoleSet" : "streamerRoleUnset", message.author.tag, (role ? role.name : "")),
            },
        }).catch(() => {
            // this error can be ignored
        });
    };
}
