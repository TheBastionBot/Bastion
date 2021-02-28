/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class VerificationCommand extends Command {
    constructor() {
        super("verification", {
            description: "It allows you to enable Captcha Verification in the server. When enabled, users joining the server need to solve a captcha, in your server's [dashboard](%bastion.dashboard%), to prove that they are human. When they successfully solve the captcha, Bastion will give them the specified Verified Role.",
            triggers: [],
            arguments: {
                alias: {
                    disable: [ "d" ],
                    role: [ "r" ],
                },
                boolean: [ "disable" ],
                string: [ "role" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "verification",
                "verification --role ROLE",
                "verification --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const guild = (message.guild as BastionGuild);

        if (argv.disable) {
            guild.document.verifiedRoleId = undefined;
            delete guild.document.verifiedRoleId;
        } else if (argv.role) {
            // find the role
            const role = this.client.resolver.resolveRole(guild, argv.role);

            // check whether the role exists
            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            // set the verified role
            guild.document.verifiedRoleId = role.id;
        } else {
            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.verifiedRoleId ? "verificationEnabled" : "verificationDisabled", guild.document.verifiedRoleId ? message.guild.roles.cache.get(guild.document.verifiedRoleId).name : undefined),
                },
            });
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.verifiedRoleId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.verifiedRoleId ? "verificationRoleSet" : "verificationRoleUnset", message.author.tag, guild.document.verifiedRoleId ? message.guild.roles.cache.get(guild.document.verifiedRoleId).name : undefined),
            },
        });
    }
}
