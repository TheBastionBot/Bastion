/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");

export = class GrantCommand extends Command {
    constructor() {
        super("grant", {
            description: "It allows you to grant experience or coins to the members of the server.",
            triggers: [],
            arguments: {
                default: {
                    xp: 0,
                    coins: 0,
                },
                number: [ "xp", "coins" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "grant --xp NUMBER",
                "grant --coins NUMBER",
                "grant --user USER --xp NUMBER",
                "grant --user USER --coins NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // command syntax validation
        if (!argv.xp && !argv.coins) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        if (argv.user) {
            // check whether the specified user is a server member
            const member = this.client.resolver.resolveGuildMember(message.guild, argv.user);
            if (!member) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "memberNotFound"));

            // get user's profile data
            const memberProfile = await MemberModel.findOne({ user: member.id, guild: message.guild.id });
            // check whether user profile exists
            if (!memberProfile) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "profileNotFound", member.user.tag));

            // update XP & coins
            await MemberModel.updateOne({
                user: member.id,
                guild: message.guild.id,
            }, {
                $inc: {
                    experience: argv.xp ? argv.xp : 0,
                    balance: argv.coins ? argv.coins : 0,
                },
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "grantMember", message.author.tag, argv.xp ? argv.xp : 0, argv.coins ? argv.coins : 0, member.displayName),
                },
            });
        }

        // update XP & coins
        await MemberModel.updateMany({
            guild: message.guild.id,
        }, {
            $inc: {
                experience: argv.xp ? argv.xp : 0,
                balance: argv.coins ? argv.coins : 0,
            },
        });

        // acknowledge
        return await message.channel.send({
            embed: {
                color: Constants.COLORS.GREEN,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "grantMembers", message.author.tag, argv.xp ? argv.xp : 0, argv.coins ? argv.coins : 0),
            },
        });
    }
}
