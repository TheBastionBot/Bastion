/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, User } from "discord.js";

import * as pagination from "../../utils/pagination";
import * as errors from "../../utils/errors";

import BastionGuildMember = require("../../structures/GuildMember");

export = class Ban extends Command {
    constructor() {
        super("ban", {
            description: "It allows you to ban (or soft ban) users from the server, and optionally clear their messages from the specified number of days. It also allows you to list all the users banned in the server.",
            triggers: [],
            arguments: {
                alias: {
                    days: "d",
                    list: "l",
                    page: "p",
                    soft: "s",
                    user: "u",
                },
                boolean: [ "list", "soft" ],
                default: {
                    days: 0,
                    page: 1,
                },
                number: [ "days", "page" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "BAN_MEMBERS" ],
            userPermissions: [ "BAN_MEMBERS" ],
            syntax: [
                "ban --list",
                "ban --list --page 3",
                "ban --user USER_ID -- REASON",
                "ban --user USER_ID --soft -- REASON",
                "ban --user USER_ID --days NUMBER -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // List Bans
        if (argv.list) {
            const bans = await message.guild.fetchBans();

            const banInfo = pagination.paginate([ ...bans.values() ], argv.page);

            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.ORANGE,
                    title: "Banned Users",
                    description: "Users banned in " + message.guild.name,
                    fields: banInfo.items.map((ban: { user: User; reason: string }) => ({
                        name: ban.user.tag + " / " + ban.user.id,
                        value: ban.reason || "-",
                    })),
                    footer: {
                        text: `Page ${banInfo.page} of ${banInfo.pages}`
                    },
                },
            });
        }

        // Resolve user
        const user = this.client.resolver.resolveUser(argv.user);

        // Command Syntax Validation
        if (!user) throw new errors.CommandSyntaxError(this.name);

        // Check command user's permission over target member
        if (message.author.id !== message.guild.ownerID && message.guild.members.cache.has(user.id) && !(message.member as BastionGuildMember).canManage(message.guild.members.cache.get(user.id))) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    title: this.client.locale.getString("en_us", "errors", "unauthorized"),
                    description: this.client.locale.getString("en_us", "errors", "rolePosition", message.author.tag, user.tag),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Ban user
        const reason = argv._.join(" ") || "-";

        await message.guild.members.ban(user, {
            days: argv.days,
            reason: reason,
        });

        // Unban user, if it was a soft ban
        if (argv.soft) {
            await message.guild.members.unban(user, reason);
        }

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.DARK_BUT_NOT_BLACK,
                description: argv.soft
                    ? this.client.locale.getString("en_us", "info", "memberSoftBan", message.author.tag, user.tag)
                    : this.client.locale.getString("en_us", "info", "guildBanAdd", message.author.tag, user.tag),
                fields: [
                    {
                        name: "Reason",
                        value: reason,
                    },
                ],
                footer: {
                    text: user.id,
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
