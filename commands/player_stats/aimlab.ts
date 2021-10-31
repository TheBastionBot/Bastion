/*!
 * @author TRACTION (iamtraction)
 * @copyright 2021 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";

export = class AimLabCommand extends Command {
    constructor() {
        super("aimlab", {
            description: "It allows you to see the stats of any Aim Lab player.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "aimlab USERNAME",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");

        // get stats
        const rawResponse = await requests.post("https://api.aimlab.gg/graphql", null, null, {
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
                username: encodeURIComponent(player),
            },
        });
        const response = await rawResponse.json();

        // check for errors
        if (response.error) throw new Error(response.error);

        if (!response?.data?.aimlabProfile) {
            throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, "The profile you're looking for was not found.");
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.AIM_LAB,
                author: {
                    name: "Aim Lab - Player Stats",
                    icon_url: "https://liquipedia.net/commons/images/a/a2/Aim_Lab_logo.png",
                },
                title: response?.data?.aimlabProfile?.username,
                fields: [
                    {
                        name: "Rank",
                        value: response?.data?.aimlabProfile?.ranking?.rank?.displayName,
                        inline: true,
                    },
                    {
                        name: "Skill",
                        value: (response?.data?.aimlabProfile?.ranking?.skill as unknown as number)?.toFixed(),
                        inline: true,
                    },
                    {
                        name: "Progress",
                        value: ((response?.data?.aimlabProfile?.ranking?.skill - response?.data?.aimlabProfile?.ranking?.rank?.minSkill) / (response?.data?.aimlabProfile?.ranking?.rank?.maxSkill - response?.data?.aimlabProfile?.ranking?.rank?.minSkill) * 100).toFixed() + "%",
                        inline: true,
                    },
                    response?.data?.aimlabProfile?.skillScores?.map((skill: { name: string; score: string }) => ({
                        name: skill.name[0].toUpperCase() + skill.name.slice(1),
                        value: (skill.score as unknown as number).toFixed(),
                        inline: true,
                    })),
                ],
                thumbnail: {
                    url: "https://aimlab.gg/static/aimlab/ranks/" + response?.data?.aimlabProfile?.ranking?.rank?.displayName?.toLowerCase()?.replace(" ", "_") + ".png",
                },
                footer: {
                    text: "Powered by Aim Lab",
                },
            },
        });
    };
}
