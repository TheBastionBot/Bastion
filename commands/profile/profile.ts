/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import MemberModel from "../../models/Member";
import UserModel from "../../models/User";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");
import BastionUser = require("../../structures/User");

import * as badges from "../../utils/badges";
import * as gamification from "../../utils/gamification";
import progress from "../../utils/progress";

export = class ProfileCommand extends Command {
    constructor() {
        super("profile", {
            description: "It allows you to see your (or any of the server member's) Bastion Profile.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "profile",
                "profile USER",
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
        if (!userProfile || !memberProfile) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "profileNotFound"));

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

        // calculate level progress
        const requiredXP = {
            currentLevel: gamification.computeExperience(memberProfile.level, (message.guild as BastionGuild).document.gamification ? (message.guild as BastionGuild).document.gamification.multiplier : gamification.DEFAUL_LEVELUP_MULTIPLIER),
            nextLevel: gamification.computeExperience(memberProfile.level + 1, (message.guild as BastionGuild).document.gamification ? (message.guild as BastionGuild).document.gamification.multiplier : gamification.DEFAUL_LEVELUP_MULTIPLIER),
        };

        const totalRequiredXP = {
            currentLevel: memberProfile.experience - requiredXP.currentLevel,
            nextLevel: requiredXP.nextLevel - requiredXP.currentLevel
        };

        const currentProgress = totalRequiredXP.currentLevel / totalRequiredXP.nextLevel * 100;


        // get user badges
        const userBadges = await badges.fetchBadges(member.id).then(res => res.json()).catch(() => {
            // this error can be ignored
        });


        // acknowledge
        message.channel.send({
            embed: {
                color: userProfile.color || Constants.COLORS.IRIS,
                author: {
                    name: member.user.tag,
                },
                title: "Bastion Profile",
                description: (userBadges && "badgeValue" in userBadges ? badges.resolveBadges(userBadges.badgeValue) : []).map(badge => badge.emoji).join(" "),
                fields: [
                    {
                        name: "About",
                        value: userProfile.info || "-",
                    },
                    {
                        name: "Rank",
                        value: rank + 1,
                        inline: true,
                    },
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
                    {
                        name: "Bastion Coins",
                        value: memberProfile.balance,
                        inline: true,
                    },
                    {
                        name: "Progress - " + totalRequiredXP.currentLevel + " / " + totalRequiredXP.nextLevel + " - " + Math.round(currentProgress) + "%",
                        value: "`" + progress(currentProgress, 35) + "`",
                    },
                    {
                        name: "Cake Day",
                        value: userProfile.cakeDay ? userProfile.cakeDay.toDateString() : "-",
                        inline: true,
                    },
                    {
                        name: "Location",
                        value: userProfile.location || "-",
                        inline: true,
                    },
                ],
                thumbnail: {
                    url: member.user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                image: {
                    url: userProfile.backdrop,
                },
                footer: {
                    text: member.id === this.client.locale.getConstant("author.discord.id") ? "Oh, hey! Here's my developer!" : "",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
