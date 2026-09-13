/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";
import Settings from "../../utils/settings.js";
import { twitchRequest } from "../../utils/twitch.js";

interface Game {
    alternative_names?: string[];
    artworks?: string[];
    cover?: {
        url: string;
    };
    first_release_date?: number;
    game_modes?: number[];
    genres?: string[];
    name?: string;
    platforms?: string[];
    screenshots?: [];
    summary?: string;
    total_rating?: number;
    url?: string;
    version_title?: string;
    websites?: {
        url: string;
    }[];
}

class GameCommand extends Command {
    constructor() {
        super({
            name: "game",
            description: "Searches for information on the specified game.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the game.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const client = interaction.client as Client;
        const name = interaction.options.getString("name");

        const url = "https://api.igdb.com/v4/games?" + new URLSearchParams({
            fields: "*, alternative_names.*, artworks.*, cover.*, genres.*, platforms.*, screenshots.*, videos.*, websites.*",
            limit: "10",
            search: name,
        });

        const unavailable = (): Promise<unknown> => interaction.editReply(client.locales.getText(interaction.guildLocale, "searchUnavailable", { item: "games" }));

        const response = await twitchRequest(client.settings as Settings, headers => requests.post(url, headers)).catch(Logger.error);
        if (!response) return await unavailable();

        if (response.statusCode >= 400) {
            Logger.error(`IGDB responded with ${ response.statusCode }: ${ await response.body.text().catch(() => "") }`);
            return await unavailable();
        }

        const games = await response.body.json().catch(Logger.error) as Game[];
        if (!games) return await unavailable();

        if (games?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        author: {
                            name: games[0].version_title,
                        },
                        title: games[0].name,
                        url: games[0].url,
                        description: games[0].summary,
                        fields: [
                            {
                                name: "Rating",
                                value: games[0].total_rating ? games[0].total_rating.toFixed(2) : "-",
                                inline: true,
                            },
                            {
                                name: "Release Date",
                                value: games[0].first_release_date ? new Date(games[0].first_release_date * 1000).toDateString() : "-",
                                inline: true,
                            },
                            {
                                name: "Links",
                                value: games[0].websites?.map(site => site?.url)?.join("\n") || "-",
                            },
                        ],
                        image: {
                            url: games[0].cover?.url?.startsWith("//") ? "https:" + games[0].cover.url.replace("t_thumb", "t_cover_big") : "",
                        },
                        footer: {
                            text: "Powered by Twitch",
                        },
                    },
                ],
            });
        }

        await interaction.editReply(client.locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "game",
            query: name,
        }));
    }
}

export { GameCommand as Command };
