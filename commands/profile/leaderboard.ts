/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { EmbedFieldData, Message } from "discord.js";

import MemberModel from "../../models/Member";

export = class LeaderboardCommand extends Command {
    constructor() {
        super("leaderboard", {
            description: "It allows you to see the leaderboard of your server. You're ranked based on your level, experience, karma, and Bastion Coins; in that exact order.",
            triggers: [ "lb" ],
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
        // fetch top 5 members
        const members = await MemberModel.find({
            guild: message.guild.id,
        }, null, {
            sort: {
                level: -1,
                experience: -1,
                karma: -1,
                balance: -1,
            },
            limit: 5,
        });

        // acknowledge
        message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: message.guild.name,
                    url: this.client.locale.getConstant("bastion.website") + "/servers/" + message.guild.id,
                },
                title: "Leaderboard",
                fields: members.map((member, i) => [
                    {
                        name: "#" + (i + 1) + " - " + (this.client.users.cache.has(member.user) ? this.client.users.cache.get(member.user).tag + " / " : "") + member.user,
                        value: member.balance + " Bastion Coins",
                    },
                    {
                        name: "Level",
                        value: member.level,
                        inline: true,
                    },
                    {
                        name: "XP",
                        value: member.experience,
                        inline: true,
                    },
                    {
                        name: "Karma",
                        value: member.karma,
                        inline: true,
                    },
                ]) as unknown as EmbedFieldData[],
                thumbnail: {
                    url: "https://i.imgur.com/Kzt8Ldk.png",
                },
                footer: {
                    text: "Bastion Profiles - Leaderboard",
                },
            },
        });
    }
}
