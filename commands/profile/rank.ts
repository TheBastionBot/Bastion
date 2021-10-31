/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import UserModel from "../../models/User";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");
import BastionUser = require("../../structures/User");

export = class RankCommand extends Command {
    constructor() {
        super("rank", {
            description: "It allows you to see your (or any of the server member's) rank, level, experience, and karma.",
            triggers: [ "level", "xp" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "rank",
                "rank USER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const identifier = argv._.length ? argv._[0] : message.author.id;

        // check whether the specified user is a server member
        const member = identifier === message.author.id ? message.member : this.client.resolver.resolveGuildMember(message.guild, identifier);
        if (!member) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "memberNotFound"));

        // get user's profile data
        const userProfile = identifier === message.author.id ? (message.author as BastionUser).document : await UserModel.findById(identifier);
        const memberProfile = identifier === message.author.id ? (member as BastionGuildMember).document : await MemberModel.findOne({ user: identifier, guild: message.guild.id });
        // check whether user profile exists
        if (!userProfile || !memberProfile) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "profileNotFound", member.user.tag));

        // calculate the rank of the member
        const rank = await MemberModel.find({ guild: message.guild.id }, null, { sort: {
            level: -1,
            experience: -1,
            karma: -1,
            balance: -1,
        } }).countDocuments({
            $or: [
                {
                    level: { $gt: memberProfile.level },
                },
                {
                    level: memberProfile.level,
                    experience: { $gt: memberProfile.experience },
                },
                {
                    level: memberProfile.level,
                    experience: memberProfile.experience,
                    karma: { $gt: memberProfile.karma },
                },
                {
                    level: memberProfile.level,
                    experience: memberProfile.experience,
                    karma: memberProfile.karma,
                    balance: { $gt: memberProfile.balance },
                },
            ],
        });


        // acknowledge
        await message.channel.send({
            embed: {
                color: userProfile.color || Constants.COLORS.IRIS,
                author: {
                    name: member.user.tag,
                },
                title: "Rank " + (rank + 1),
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "checkProfile"),
                fields: [
                    {
                        name: "Level",
                        value: memberProfile.level,
                        inline: true,
                    },
                    {
                        name: "Experience",
                        value: memberProfile.experience,
                        inline: true,
                    },
                    {
                        name: "Karma",
                        value: memberProfile.karma,
                        inline: true,
                    },
                ],
                thumbnail: {
                    url: member.user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    };
}
