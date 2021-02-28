/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as badges from "../../utils/badges";
import * as constants from "../../utils/constants";

export = class ServerCommand extends Command {
    constructor() {
        super("server", {
            description: "It allows you see the information of the server.",
            triggers: [ "serverInfo" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // get guild badges
        const guildBadges = constants.isPublicBastion(this.client.user) && await badges.fetchBadges(message.guild.ownerID, message.guild.id).then(res => res.json()).catch(() => {
            // this error can be ignored
        });
        // check for premium membership
        const guildMembership = badges.getMembership(guildBadges ? guildBadges.badgeValue : 0);


        await message.guild.fetch().catch(() => {
            // this error can be ignored
        });

        // acknowledge
        message.channel.send({
            embed: {
                color: guildMembership ? guildMembership.color : Constants.COLORS.IRIS,
                author: {
                    name: message.guild.name,
                    url: this.client.locale.getConstant("bastion.website") + "/servers/" + message.guild.id,
                },
                title: (message.guild.partnered ? "Partnered" : message.guild.verified ? "Verified" : "") + " Server",
                description: (guildBadges && "badgeValue" in guildBadges ? badges.resolveBadges(guildBadges.badgeValue) : []).map(badge => badge.emoji).join(" "),
                fields: [
                    {
                        name: "About",
                        value: message.guild.description || "-",
                    },
                    {
                        name: "Owner",
                        value: message.guild.owner.user.tag + " • " + message.guild.owner.id,
                    },
                    {
                        name: "Level",
                        value: "Level " + message.guild.premiumTier + " • " + message.guild.premiumSubscriptionCount + " Boosts",
                        inline: true,
                    },
                    {
                        name: "Region",
                        value: message.guild.region.toUpperCase(),
                        inline: true,
                    },
                    {
                        name: "Created",
                        value: message.guild.createdAt.toUTCString(),
                        inline: true,
                    },
                    {
                        name: "Members",
                        value: message.guild.memberCount
                            + (message.guild.maximumMembers ? " / " + message.guild.maximumMembers : "") + " Members",
                    },
                    {
                        name: "Roles",
                        value: message.guild.roles.cache.size + " Roles",
                        inline: true,
                    },
                    {
                        name: "Channels",
                        value: message.guild.channels.cache.filter(c => c.type !== "category").size + " Channels",
                        inline: true,
                    },
                    {
                        name: "Emojis",
                        value: message.guild.emojis.cache.size + " Emojis",
                        inline: true,
                    },
                ],
                thumbnail: {
                    url: message.guild.iconURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                image: {
                    url: message.guild.banner ? message.guild.bannerURL({ size: 2048 }) : message.guild.splash ? message.guild.splashURL({ size: 2048 }) : message.guild.discoverySplash ? message.guild.discoverySplashURL({ size: 2048 }) : null,
                },
                footer: {
                    text: (guildMembership ? guildMembership.name : "Powered by Bastion") + " • " + message.guild.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
