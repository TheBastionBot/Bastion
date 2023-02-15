/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";

class OverwatchCommand extends Command {
    constructor() {
        super({
            name: "overwatch",
            description: "Check stats of any Overwatch 2 player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The BattleTag or username of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "platform",
                    description: "The platform of the player.",
                    choices: [
                        { name: "PC", value: "pc" },
                        { name: "PlayStation", value: "psn" },
                        { name: "Xbox", value: "xbl" },
                        { name: "Nintendo Switch", value: "nintendo-switch" },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "region",
                    description: "The region of the player.",
                    choices: [
                        { name: "Americas", value: "us" },
                        { name: "Europe", value: "eu" },
                        { name: "Asia", value: "asia" },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");
        const platform = interaction.options.getString("platform") || "pc";
        const region = interaction.options.getString("region") || "us";

        // get stats
        const { body } = await requests.get("https://ow-api.com/v1/stats/" + platform + "/" + region + "/" + (username.replace("#", "-")) + "/profile");
        const response = await body.json();

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.OVERWATCH,
                    author: {
                        name: "Overwatch 2 — Player Stats",
                        icon_url: "https://us.forums.blizzard.com/en/overwatch/plugins/discourse-blizzard-themes/images/icons/overwatch-social.jpg",
                    },
                    title: username,
                    description: response.private ? "This is a Private profile." : "",
                    url: "https://overwatch.blizzard.com/en-us/career/" + username.replace("#", "-"),
                    fields: response.private ? [] : [
                        {
                            name: "Tank",
                            value: response.ratings.find(r => r.role === "tank") ? `${ response.ratings.find(r => r.role === "tank").group } ${ response.ratings.find(r => r.role === "tank").tier }` : "-",
                            inline: true,
                        },
                        {
                            name: "Damage",
                            value: response.ratings.find(r => r.role === "offense") ? `${ response.ratings.find(r => r.role === "offense").group } ${ response.ratings.find(r => r.role === "offense").tier }` : "-",
                            inline: true,
                        },
                        {
                            name: "Support",
                            value: response.ratings.find(r => r.role === "support") ? `${ response.ratings.find(r => r.role === "support").group } ${ response.ratings.find(r => r.role === "support").tier }` : "",
                            inline: true,
                        },
                        {
                            name: "Games Played",
                            value: response.gamesPlayed?.toLocaleString() || "-",
                            inline: true,
                        },
                        {
                            name: "Games Won",
                            value: response.gamesWon?.toLocaleString() || "-",
                            inline: true,
                        },
                        {
                            name: "Games Lost",
                            value: response.gamesLost?.toLocaleString() || "-",
                            inline: true,
                        },
                    ],
                    thumbnail: {
                        url: response.icon,
                    },
                    footer: {
                        icon_url: response.private ? "" : response.endorsementIcon,
                        text: response.private ? "" : "Endorsement Level " + (response.endorsement || 0),
                    },
                },
            ],
        });
    }
}

export { OverwatchCommand as Command };
