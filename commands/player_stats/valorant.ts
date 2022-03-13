/*!
 * @author TRACTION (iamtraction)
 * @copyright 2021 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";

export = class ValorantCommand extends Command {
    regions: string[];

    constructor() {
        super("valorant", {
            description: "It allows you to see the stats of any VALORANT player.",
            triggers: [],
            arguments: {
                alias: {
                    region: [ "r" ],
                },
                string: [ "region" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "valorant NAME#TAG --region REGION",
            ],
        });

        this.regions = [ "NA", "EU", "AP", "KR" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        if (!this.regions.includes(argv.region?.toUpperCase())) throw new errors.DiscordError("Invalid Region", "You've entered an invalid region. These are the valid regions: " + this.regions.join(", ") + ". Use NA as the region if you want to select LATAM or BR.");

        // identify player & platform
        const player = argv._.join(" ").split("#");

        // get account data
        const rawResponse = await requests.get("https://api.henrikdev.xyz/valorant/v1/account/" + encodeURIComponent(player[0]) + "/" + encodeURIComponent(player[1]));
        const response = await rawResponse.json();
        // get mmr data
        const rawMMRResponse = await requests.get("https://api.henrikdev.xyz/valorant/v2/mmr/" + argv.region + "/" + encodeURIComponent(player[0]) + "/" + encodeURIComponent(player[1]));
        const mmrResponse = await rawMMRResponse.json();

        // check for errors
        if (response.status !== "200") throw new Error(response.error);

        const actStats = mmrResponse?.data?.by_season?.[Object.keys(mmrResponse?.data?.by_season)[0]];

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.VALORANT,
                author: {
                    name: "VALORANT - Player Stats",
                    icon_url: "https://i.imgur.com/WX6JkyV.png",
                },
                title: response?.data?.name + "#" + response?.data?.tag,
                fields: [
                    {
                        name: "Region",
                        value: response?.data?.region?.toUpperCase(),
                        inline: true,
                    },
                    {
                        name: "Level",
                        value: response?.data?.account_level,
                        inline: true,
                    },
                    ...(mmrResponse?.data?.current_data?.elo ?
                        [
                            {
                                name: "Rank",
                                value: mmrResponse?.data?.current_data?.currenttierpatched,
                                inline: true,
                            },
                            {
                                name: "ELO",
                                value: mmrResponse?.data?.current_data?.elo,
                                inline: true,
                            },
                            ...(actStats?.error ?
                                [
                                    {
                                        name: "Placement",
                                        value: mmrResponse?.data?.current_data?.games_needed_for_rating + " Matches",
                                        inline: true,
                                    },
                                ] : [
                                    {
                                        name: "Wins",
                                        value: actStats?.wins + " Matches",
                                        inline: true,
                                    },
                                    {
                                        name: "Played",
                                        value: actStats?.number_of_games + " Matches",
                                        inline: true,
                                    },
                                ]
                            ),
                        ] : []
                    ),
                ],
                thumbnail: {
                    // TODO: use rank badge
                    url: response?.data?.card?.small,
                },
                image   : {
                    url: response?.data?.card?.wide,
                },
                footer: {
                    text: "Powered by VALORANT",
                },
            },
        });
    };
}
