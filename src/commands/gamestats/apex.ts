/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";

class ApexLegendsCommand extends Command {
    constructor() {
        super({
            name: "apex",
            description: "Check stats of any Apex Legends player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The username of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "platform",
                    description: "The platform of the player.",
                    choices: [
                        { name: "PC", value: "origin" },
                        { name: "PlayStation", value: "psn" },
                        { name: "Xbox", value: "xbl" },
                    ],
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");
        const platform = interaction.options.getString("platform");

        // get stats
        const response = await requests.get(`https://public-api.tracker.gg/v2/apex/standard/profile/${ platform }/${ encodeURIComponent(username) }`, {
            "TRN-Api-Key": ((interaction.client as Client).settings as Settings).get("trackerNetworkApiKey"),
        });

        const body = await response.body.json();
        const overview = body?.data?.segments?.find((s: { type: string }) => s.type === "overview");

        if (!Object.keys(overview?.stats || {})?.length) return await interaction.editReply(`The profile for **${ username }** was not found in the specified platform.`);

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.APEX_LEGENDS,
                    author: {
                        name: body.data.platformInfo.platformUserHandle,
                        icon_url: body.data.platformInfo.avatarUrl,
                    },
                    title: "Apex Legends — Player Stats",
                    url: "https://steamcommunity.com/id/" + body.data.platformInfo.platformUserHandle,
                    description: body.data.metadata.activeLegendName ? body.data.platformInfo.platformUserHandle + " is currently playing with " + body.data.metadata.activeLegendName : null,
                    fields: [
                        {
                            name: "Rank",
                            value: overview.stats.rankScore ? overview.stats.rankScore.metadata.rankName + " / " + overview.stats.rankScore.displayValue : "-",
                            inline: true,
                        },
                        ...Object.keys(overview.stats).filter(k => k !== "rankScore").map(k => ({
                            name: overview.stats[k].displayName,
                            value: overview.stats[k].displayValue,
                            inline: true,
                        })),
                    ],
                    thumbnail: {
                        url: overview.stats.rankScore ? overview.stats.rankScore.metadata.iconUrl : body.data.platformInfo.avatarUrl,
                    },
                    footer: {
                        text: "Powered by Tracker Network",
                    },
                },
            ],
        });
    }
}

export { ApexLegendsCommand as Command };
