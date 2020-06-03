/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class VoiceMute extends Command {
    constructor() {
        super("voiceMute", {
            description: "It allows you to voice mute (and unmute) users in a channel. Voice muted users can't speak in the voice channels they are muted.",
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
            clientPermissions: [ "MUTE_MEMBERS" ],
            userPermissions: [ "MUTE_MEMBERS" ],
            syntax: [
                "voiceMute --user USER_ID -- REASON",
                "voiceMute --unset --user USER_ID -- REASON",
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
                    title: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "unauthorized"),
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "rolePosition", message.author.tag, member.user.tag),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        const reason = argv._.join(" ") || "-";

        // Set Voice Mute
        await member.voice.setMute(!!argv.set, reason);

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: argv.set
                    ? this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "memberSetVoiceMute", message.author.tag, member.user.tag)
                    : this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "memberUnsetVoiceMute", message.author.tag, member.user.tag),
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
