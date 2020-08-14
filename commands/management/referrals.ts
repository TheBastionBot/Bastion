/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import GuildModel from "../../models/Guild";
import MemberModel from "../../models/Member";
import * as pagination from "../../utils/pagination";
import BastionGuild = require("../../structures/Guild");

export = class ReferralsCommand extends Command {
    constructor() {
        super("referrals", {
            description: "It allows you set the Referrals Channel so that members can invite others to the server and gain referral rewards. And it also allows you to track the members' invites.",
            triggers: [],
            arguments: {
                alias: {
                    page: [ "p" ],
                },
                boolean: [ "enable", "disable" ],
                number: [ "page" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_GUILD" ],
            userPermissions: [],
            syntax: [
                "referrals",
                "referrals --page NUMBER",
                "referrals --enable",
                "referrals --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.enable || argv.disable) {
            if (argv.enable) {
                // set the referrals channel, enabling referrals in the server
                await GuildModel.findByIdAndUpdate(message.guild.id, {
                    referralsChannel: message.channel.id,
                });
            } else {
                // remove referrals channel, disabling referrals altogether
                await GuildModel.findByIdAndUpdate(message.guild.id, {
                    $unset: {
                        referralsChannel: 1,
                    },
                });
            }

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: argv.enable ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                    title: "Referrals Channel",
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.enable ? "referralsEnable" : "referralsDisable", message.author.tag),
                },
            });
        }

        const members = await MemberModel.find({
            guild: message.guild.id,
            referral: {
                $exists: true,
            },
        });

        const invites = await message.guild.fetchInvites();

        // paginate output
        const paginatedMembers = pagination.paginate(members.filter(m => m.referral && Array.from(invites.keys()).includes(m.referral)).map(member => ({
            name: message.guild.members.cache.has(member.user) ? message.guild.members.cache.get(member.user).user.tag : member.user,
            value: member.referral + " - " + invites.get(member.referral).uses + " Uses",
        })), argv.page);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Referrals",
                fields: paginatedMembers.items,
                footer: {
                    text: `Page ${paginatedMembers.page} of ${paginatedMembers.pages}`
                },
            },
        });
    }
}
