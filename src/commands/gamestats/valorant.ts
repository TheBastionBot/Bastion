/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";
import { COLORS } from "../../utils/constants";

class ValorantCommand extends Command {
    constructor() {
        super({
            name: "valorant",
            description: "Check stats of any Valorant player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The name tag of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "region",
                    description: "The region of the account.",
                    choices: [
                        { name: "Americas", value: "na" },
                        { name: "Europe", value: "eu" },
                        { name: "Asia-Pacific", value: "ap" },
                        { name: "Korea", value: "kr" },
                    ],
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");
        const region = interaction.options.getString("region");

        const player = username.split("#");

        // get account data
        const accountResponse = await requests.get(`https://api.henrikdev.xyz/valorant/v1/account/${ encodeURIComponent(player[0]) }/${ encodeURIComponent(player[1]) }`);
        const account = await accountResponse.body.json();

        if (accountResponse.statusCode !== 200) {
            await interaction.editReply(`The profile for **${ username }** was not found in the specified region.`);
        }

        // get mmr data
        const mmrResponse = await requests.get(`https://api.henrikdev.xyz/valorant/v2/mmr/${ region }/${ encodeURIComponent(player[0]) }/${ encodeURIComponent(player[1]) }`);
        const mmr = await mmrResponse.body.json();

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.VALORANT,
                    author: {
                        name: "VALORANT — Player Stats",
                        icon_url: "https://i.imgur.com/WX6JkyV.png",
                    },
                    title: account?.data?.name + "#" + account?.data?.tag,
                    fields: [
                        {
                            name: "Region",
                            value: account?.data?.region?.toUpperCase(),
                            inline: true,
                        },
                        {
                            name: "Level",
                            value: account?.data?.account_level,
                            inline: true,
                        },
                        ...(mmr?.data?.current_data?.elo ?
                            [
                                {
                                    name: "ELO",
                                    value: mmr?.data?.current_data?.elo,
                                    inline: true,
                                },
                                {
                                    name: "Rank",
                                    value: mmr?.data?.current_data?.currenttierpatched,
                                    inline: true,
                                },
                                {
                                    name: "RR",
                                    value: mmr?.data?.current_data?.ranking_in_tier,
                                    inline: true,
                                },
                                {
                                    name: mmr?.data?.by_season?.[Object.keys(mmr?.data?.by_season)[0]]?.error ? "Placement" : "Wins",
                                    value: mmr?.data?.by_season?.[Object.keys(mmr?.data?.by_season)[0]]?.error ? `${ mmr?.data?.current_data?.games_needed_for_rating } Games` : `${ mmr?.data?.by_season?.[Object.keys(mmr?.data?.by_season)[0]]?.wins } / ${ mmr?.data?.by_season?.[Object.keys(mmr?.data?.by_season)[0]]?.number_of_games } Games`,
                                    inline: true,
                                },
                            ] : []
                        ),
                    ],
                    thumbnail: {
                        url: mmr?.data?.current_data?.images?.large,
                    },
                    image: {
                        url: account?.data?.card?.wide,
                    },
                    footer: {
                        text: "Powered by VALORANT",
                    },
                    timestamp: new Date(account?.data?.last_update_raw * 1000).toISOString(),
                },
            ],
        });
    }
}

export = ValorantCommand;
