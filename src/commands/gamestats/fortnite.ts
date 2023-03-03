/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";

class FortniteCommand extends Command {
    constructor() {
        super({
            name: "fortnite",
            description: "Check stats of any Fortnite player.",
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
                        { name: "PC", value: "kbm" },
                        { name: "Console", value: "gamepad" },
                        { name: "Mobile", value: "touch" },
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
        const response = await requests.get(`https://api.fortnitetracker.com/v1/profile/${ platform }/${ encodeURIComponent(username) }`, {
            "TRN-Api-Key": ((interaction.client as Client).settings as Settings).get("trackerNetworkApiKey"),
        });

        const body = await response.body.json();

        if (!body?.lifeTimeStats?.length) return await interaction.editReply(`The profile for **${ username }** was not found in the specified platform.`);

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.FORTNITE,
                    author: {
                        name: "Fortnite — Player Stats",
                    },
                    title: body.epicUserHandle,
                    fields: body.lifeTimeStats.map((stat: { key: string; value: string }) => ({
                        name: stat.key,
                        value: stat.value,
                        inline: true,
                    })),
                    footer: {
                        text: body.platformNameLong.toUpperCase() + " • Powered by Tracker Network",
                    },
                },
            ],
        });
    }
}

export { FortniteCommand as Command };
