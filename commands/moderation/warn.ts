/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import * as arrays from "../../utils/arrays";
import * as errors from "../../utils/errors";
import * as pagination from "../../utils/pagination";

import BastionGuildMember = require("../../structures/GuildMember");

export = class Warn extends Command {
    constructor() {
        super("warn", {
            description: "It allows you to warn server members, as well as clear their infractions. It also allows you to list all the infractions.",
            triggers: [],
            arguments: {
                alias: {
                    clear: "c",
                    list: "l",
                    user: "u",
                },
                boolean: [ "clear", "list" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "KICK_MEMBERS" ],
            syntax: [
                "warn --list",
                "warn --user USER_ID -- REASON",
                "warn --user USER_ID --clear -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // list infractions
        if (argv.list) {
            const warnedMemberDocuments = await MemberModel.find({
                guild: message.guild.id,
                infractions: { $exists: true, $ne: [] },
            });

            const warnedMembers = pagination.paginate(warnedMemberDocuments, argv.page);

            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.ORANGE,
                    title: "Warned Users",
                    description: warnedMembers.items.length ? "Users warned in the server." : "No one has been warned in the server.",
                    fields: warnedMembers.items.map((member: { _id: string; infractions: string[] }) => ({
                        name: message.guild.members.cache.has(member._id) ? message.guild.members.cache.get(member._id).user.tag : member._id,
                        value: arrays.toBulletList(member.infractions),
                    })),
                    footer: {
                        text: warnedMembers.items.length ? `Page ${warnedMembers.page} of ${warnedMembers.pages}` : "",
                    },
                },
            });
        }


        // Resolve member
        const member = this.client.resolver.resolveGuildMember(message.guild, argv.user) as BastionGuildMember;

        // Command Syntax Validation
        if (!member) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // Reason
        const reason = argv._.join(" ") || "-";

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


        // clear infractions
        if (argv.clear) {
            await member.clearInfractions();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.ORANGE,
                    description: this.client.locale.getString("en_us", "info", "memberInfractionsClear", message.author.tag, member.user.tag, reason),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }


        // add infraction to the member
        await member.addInfraction(reason);

        // message the member about their warning
        await message.member.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: this.client.locale.getString("en_us", "info", "memberWarnDM", message.author.tag, message.guild.name, reason),
            },
        }).catch(() => {
            // this error can be ignored
        });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: this.client.locale.getString("en_us", "info", "memberWarn", message.author.tag, member.user.tag, reason),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
