/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";

class CSGOCommand extends Command {
    constructor() {
        super({
            name: "csgo",
            description: "Check stats of any Counter-Strike: Global Offensive player.",
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

        // get stats
        const response = await requests.get("https://public-api.tracker.gg/v2/csgo/standard/profile/steam/" + encodeURIComponent(username), {
            "TRN-Api-Key": ((interaction.client as Client).settings as Settings).get("trackerNetworkApiKey"),
        });

        const body = await response.body.json();
        const overview = body?.data?.segments?.find((s: { type: string }) => s.type === "overview");

        if (!Object.keys(overview?.stats || {})?.length) return await interaction.editReply(`The profile for **${ username }** was not found.`);

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.CSGO,
                    author: {
                        name: "Counter-Strike: Global Offensive — Player Stats",
                    },
                    title: body.data.platformInfo.platformUserHandle,
                    url: "https://steamcommunity.com/id/" + body.data.platformInfo.platformUserHandle,
                    description: overview.stats.timePlayed ? body.data.platformInfo.platformUserHandle + " has played for " + (overview.stats.timePlayed.value / 60 / 60).toFixed(2) + " hours." : "",
                    fields: Object.keys(overview.stats).filter(k => k !== "timePlayed").map(k => ({
                        name: overview.stats[k].displayName,
                        value: overview.stats[k].displayValue,
                        inline: true,
                    })),
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

export { CSGOCommand as Command };
