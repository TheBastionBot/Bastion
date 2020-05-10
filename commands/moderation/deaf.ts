/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuildMember = require("../../structures/GuildMember");

export = class Deaf extends Command {
    constructor() {
        super("deaf", {
            description: "It allows you to deafen (and undeafen) users in the server. Deafened users can't listen anything in the server's voice channels.",
            triggers: [],
            arguments: {
                configuration: {
                    "negation-prefix": "un",
                },
                alias: {
                    user: "u",
                },
                default: {
                    set: true,
                },
                boolean: [ "set" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "DEAFEN_MEMBERS" ],
            userPermissions: [ "DEAFEN_MEMBERS" ],
            syntax: [
                "deaf --user USER_ID -- REASON",
                "deaf --unset --user USER_ID -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // Resolve member
        const member = this.client.resolver.resolveGuildMember(message.guild, argv.user);

        // Command Syntax Validation
        if (!member) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

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

        const reason = argv._.join(" ") || "-";

        // Set deaf
        await member.voice.setDeaf(!!argv.set, reason);

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: argv.set
                    ? this.client.locale.getString("en_us", "info", "memberSetDeaf", message.author.tag, member.user.tag)
                    : this.client.locale.getString("en_us", "info", "memberUnsetDeaf", message.author.tag, member.user.tag),
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
