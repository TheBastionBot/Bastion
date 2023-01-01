/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";
import { COLORS } from "../../utils/constants";

class AimLabCommand extends Command {
    constructor() {
        super({
            name: "aimlab",
            description: "Check stats of any Aim Lab player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The username of the player.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");

        const response = await requests.post("https://api.aimlab.gg/graphql", null, null, {
            operationName: "GetAimlabProfileAgg",
            query: `query GetAimlabProfileAgg($username: String) {
                aimlabProfile(username: $username) {
                    username
                    ranking {
                        rank {
                            displayName
                            tier
                            level
                            minSkill
                            maxSkill
                        }
                        skill
                    }
                    skillScores {
                        name
                        score
                    }
                }
            }`,
            variables: {
                username: encodeURIComponent(username),
            },
        });

        const body = await response.body.json();

        if (!body?.data?.aimlabProfile) {
            return await interaction.editReply(`The profile for **${ username }** was not found.`);
        }

        const skillScores = body.data.aimlabProfile?.skillScores?.length ? body.data.aimlabProfile.skillScores.map((skill: { name: string; score: string }) => ({
            name: skill.name[0].toUpperCase() + skill.name.slice(1),
            value: (skill.score as unknown as number).toFixed(),
            inline: true,
        })) : [];

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.AIM_LAB,
                    author: {
                        name: "Aim Lab — Player Stats",
                        icon_url: "https://liquipedia.net/commons/images/a/a2/Aim_Lab_logo.png",
                    },
                    title: body.data.aimlabProfile?.username,
                    fields: [
                        {
                            name: "Rank",
                            value: body.data.aimlabProfile?.ranking?.rank?.displayName,
                            inline: true,
                        },
                        {
                            name: "Skill Rating",
                            value: (body.data.aimlabProfile?.ranking?.skill as unknown as number)?.toFixed(),
                            inline: true,
                        },
                        {
                            name: "Progress",
                            value: ((body.data.aimlabProfile?.ranking?.skill - body.data.aimlabProfile?.ranking?.rank?.minSkill) / (body.data.aimlabProfile?.ranking?.rank?.maxSkill - body.data.aimlabProfile?.ranking?.rank?.minSkill) * 100).toFixed() + "%",
                            inline: true,
                        },
                    ].concat(skillScores),
                    thumbnail: {
                        url: "https://aimlab.gg/static/aimlab/ranks/" + body.data.aimlabProfile?.ranking?.rank?.displayName?.toLowerCase()?.replace(" ", "_") + ".png",
                    },
                    footer: {
                        text: "Powered by Aim Lab",
                    },
                },
            ],
        });
    }
}

export = AimLabCommand;
