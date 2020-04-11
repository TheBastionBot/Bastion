/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { GuildChannel, Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuildMember = require("../../structures/GuildMember");

export = class TextMute extends Command {
    constructor() {
        super("textMute", {
            description: "It allows you to text mute (and unmute) users in a channel (or category). Text muted users can't send messages in the channels they are muted.",
            triggers: [],
            arguments: {
                configuration: {
                    "negation-prefix": "un",
                },
                alias: {
                    channel: "c",
                    user: "u",
                },
                default: {
                    set: true,
                },
                boolean: [ "set", "channel" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MUTE_MEMBERS" ],
            userPermissions: [ "MUTE_MEMBERS" ],
            syntax: [
                "textMute --user USER_ID -- REASON",
                "textMute --user USER_ID --channel -- REASON",
                "textMute --unset --user USER_ID -- REASON",
                "textMute --unset --user USER_ID --channel -- REASON",
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

        const reason = argv._.join(" ") || "-";

        // Set Text Mute
        const channel = !argv.channel && (message.channel as GuildChannel).parent
            ? (message.channel as GuildChannel).parent
            : (message.channel as GuildChannel);

        await channel.updateOverwrite(member.id, {
            SEND_MESSAGES: argv.set ? false : null,
        }, reason);

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: argv.set
                    ? this.client.locale.getString("en_us", "info", "memberSetTextMute", message.author.tag, member.user.tag, channel.name)
                    : this.client.locale.getString("en_us", "info", "memberUnsetTextMute", message.author.tag, member.user.tag),
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
