/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { GuildMember, Message, User } from "discord.js";

import * as badges from "../../utils/badges";
import * as constants from "../../utils/constants";

export = class UserCommand extends Command {
    constructor() {
        super("user", {
            description: "It allows you see the information of a user.",
            triggers: [ "member", "userInfo", "memberInfo" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "user",
                "user USER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const identifier: string = argv._.join(" ");

        let user: User, member: GuildMember | void;

        // identify the user
        if (identifier) {
            user = await this.client.users.fetch(identifier);
            member = await message.guild.members.fetch(identifier).catch(() => {
                // this error can be ignored
            });
        } else {
            user = message.author;
            member = message.member;
        }


        // get user badges
        const userBadges = constants.isPublicBastion(this.client.user) && await badges.fetchBadges(user.id).then(res => res.json()).catch(() => {
            // this error can be ignored
        });
        // check for premium membership
        const userMembership = badges.getMembership(userBadges ? userBadges.badgeValue : 0);


        // get member badges
        const memberBadges = constants.isPublicBastion(this.client.user) && member ? badges.resolveBadges((userBadges ? userBadges.badgeValue : 0) | badges.getMemberBadgeValue(member)) : [];


        // acknowledge
        message.channel.send({
            embed: {
                color: userMembership ? userMembership.color : member && member.displayColor ? member.displayColor : Constants.COLORS.IRIS,
                author: {
                    name: user.tag + (member && member.nickname ? " / " + member.nickname : ""),
                },
                title: user.bot ? "Bot" : "Human",
                description: memberBadges.map(badge => badge.emoji).join(" "),
                fields: [
                    {
                        name: "Joined Discord",
                        value: user.createdAt.toUTCString(),
                        inline: true,
                    },
                    {
                        name: "Joined Server",
                        value: member ? member.joinedAt.toUTCString() : "-",
                        inline: true,
                    },
                    {
                        name: "Boosting Since",
                        value: member && member.premiumSince ? member.premiumSince.toUTCString() : "-",
                        inline: true,
                    },
                    {
                        name: "Roles",
                        value: member && member.roles.cache.size > 1 ? [ ...member.roles.cache.values() ].slice(0, member.roles.cache.size - 1).map(r => r.name).join(", ") : "-",
                    },
                ],
                thumbnail: {
                    url: user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                footer: {
                    text: (userMembership ? userMembership.name + " • " : "") + (member && member.guild.ownerID === user.id ? "Server Owner • " : "") + user.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
