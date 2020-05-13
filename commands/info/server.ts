/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as omnic from "../../utils/omnic";

export = class ServerCommand extends Command {
    constructor() {
        super("server", {
            description: "It allows you see the information of the server.",
            triggers: [],
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
        // check for premium membership
        const isPremiumGuild = await omnic.isPremiumGuild(message.guild).catch(() => {
            // this error can be ignored
        });


        await message.guild.fetch().catch(() => {
            // this error can be ignored
        });

        // acknowledge
        message.channel.send({
            embed: {
                color: isPremiumGuild ? constants.COLORS.GOLD : Constants.COLORS.IRIS,
                author: {
                    name: message.guild.name,
                },
                title: (message.guild.partnered ? "Partnered" : message.guild.verified ? "Verified" : "") + " Server",
                description: message.guild.description,
                fields: [
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
                    url: message.guild.banner ? message.guild.bannerURL({ size: 2048 }) : message.guild.splash ? message.guild.splashURL({ size: 2048 }) : null,
                },
                footer: {
                    text: "Powered by Bastion"  + (isPremiumGuild ? " Gold" : "") + " • " + message.guild.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
