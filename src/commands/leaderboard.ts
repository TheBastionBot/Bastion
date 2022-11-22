/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import MemberModel from "../models/Member";
import { COLORS } from "../utils/constants";

class LeaderboardCommand extends Command {
    constructor() {
        super({
            name: "leaderboard",
            description: "Displays the server's leaderboard. You're ranked based on their level, XP, karma, and Bastion Coins.",
            scope: "guild",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // fetch top 5 members
        const members = await MemberModel.find({
            guild: interaction.guildId,
        }, null, {
            sort: {
                level: -1,
                experience: -1,
                karma: -1,
                balance: -1,
            },
            limit: 5,
        });

        // check whether member documents have been created
        if (!members.length) return interaction.editReply("User profiles haven't been created in the server yet. Make sure gamification is enabled and members are active in the server.");

        // acknowledge
        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: interaction.guild.name,
                        // TODO: server page - url: ,
                    },
                    title: "Leaderboard",
                    fields: members.map((member, i) => [
                        {
                            name: `#${ i + 1 } — ${ interaction.client.users.cache.has(member.user) ? interaction.client.users.cache.get(member.user).tag + " / " : "" }${ member.user }`,
                            value: `${ member.balance } Bastion Coins`,
                        },
                        {
                            name: "Level",
                            value: (member.level || 0)?.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "XP",
                            value: (member.experience || 0)?.toLocaleString(),
                            inline: true,
                        },
                        {
                            name: "Karma",
                            value: (member.karma || 0)?.toLocaleString(),
                            inline: true,
                        },
                    ]).flat(),
                    thumbnail: {
                        url: "https://i.imgur.com/Kzt8Ldk.png",
                    },
                },
            ],
        });
    }
}

export = LeaderboardCommand;
