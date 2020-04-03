/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Constants, Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class Warn extends Command {
    constructor() {
        super("warn", {
            description: "",
            triggers: [],
            arguments: {
                alias: {
                    user: "u",
                },
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Resolve user
        const user = this.client.resolver.resolveUser(argv.user);

        // Reason
        const reason = argv._.join(" ");

        // Command Syntax Validation
        if (!user || !reason) throw new errors.CommandSyntaxError(this.name);

        // Add member to the cache if they don't already exist
        if (message.guild.members.cache.has(user.id)) {
            await message.guild.members.fetch({ user });
        }

        // Add the warning to the Guild Member
        const member = message.guild.members.cache.get(user.id) as BastionGuildMember;
        const guildMemberDocument = await (member).getDocument();

        if (!guildMemberDocument.warnings || !guildMemberDocument.warnings.length) {
            guildMemberDocument.warnings = [];
        }

        guildMemberDocument.warnings.push(reason);

        guildMemberDocument.save();

        // DM the User about their Warning
        await message.channel.send({
            embed: {
                color: Constants.Colors.ORANGE,
                description: this.client.locale.getString("en_us", "info", "memberWarnDM", message.author.tag, message.guild.name, reason),
            },
        }).catch(() => {
            // This error can be ignored.
        });

        // Acknowledgement
        await message.channel.send({
            embed: {
                color: Constants.Colors.DARK_BUT_NOT_BLACK,
                description: this.client.locale.getString("en_us", "info", "memberWarn", message.author.tag, user.tag, reason),
            },
        }).catch(() => {
            // This error can be ignored.
        });

        // Take Warn Action
        const guildDocument = await (message.guild as BastionGuild).getDocument();

        if (guildDocument.warnings && guildDocument.warnings.action && guildDocument.warnings.threshold && guildMemberDocument.warnings.length >= guildDocument.warnings.threshold) {
            const reason = `Warn Threshold Exceeded - ${guildMemberDocument.warnings.length} Warnings`;

            switch (guildDocument.warnings.action.toLowerCase()) {
            case "kick":
                if (member.kickable) {
                    await member.kick(reason);
                }
                break;
            case "softban":
                if (member.bannable) {
                    await member.ban({ days: 0, reason });
                    await message.guild.members.unban(member, reason);
                }
                break;
            case "ban":
                if (member.kickable) {
                    await member.ban({ days: 0, reason });
                }
                break;
            }

            // DM the User about their Warn Action
            await message.channel.send({
                embed: {
                    color: Constants.Colors.ORANGE,
                    description: this.client.locale.getString("en_us", "info", "memberWarnActionDM", message.guild.name),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }
}
