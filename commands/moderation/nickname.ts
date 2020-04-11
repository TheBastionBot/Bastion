/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuildMember = require("../../structures/GuildMember");

export = class Nickname extends Command {
    constructor() {
        super("nickname", {
            description: "It allows you to set (and unset) nicknames of the server members.",
            triggers: [],
            arguments: {
                alias: {
                    nick: "n",
                    user: "u",
                },
                array: [ "nick" ],
                string: [ "nick", "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "KICK_MEMBERS" ],
            userPermissions: [ "KICK_MEMBERS" ],
            syntax: [
                "nickname --user USER_ID --nick NICKNAME -- REASON",
                "nickname --user USER_ID -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // Resolve member
        const member = this.client.resolver.resolveGuildMember(message.guild, argv.user);

        // Command Syntax Validation
        if (!member) throw new errors.CommandSyntaxError(this.name);

        // Check command user's permission over target member
        if (message.author.id !== message.guild.ownerID && !(message.member as BastionGuildMember).canManage(member)) {
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

        // Set member nickname
        const reason = argv._.join(" ") || "-";

        await member.setNickname(argv.nick.join(" ") || "", reason);

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: argv.nick
                    ? this.client.locale.getString("en_us", "info", "nickUpdate", message.author.tag, member.user.tag, argv.nick)
                    : this.client.locale.getString("en_us", "info", "nickRemove", message.author.tag, member.user.tag),
                fields: [
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
