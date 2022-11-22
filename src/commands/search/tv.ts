/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildTextBasedChannel, ThreadChannel } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";
import { bastion } from "../../types";
import { COLORS } from "../../utils/constants";

interface TVShow {
    id: number;
    popularity: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
    adult: false;
    backdrop_path: string;
    original_language: string;
    genre_ids: number[];
    name: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
}

interface TVShowResponse {
    page: number;
    total_results: number;
    total_pages: number;
    results: TVShow[];
}

class TVCommand extends Command {
    private genres: { [key: string]: string };

    constructor() {
        super({
            name: "tv",
            description: "Searches for information on the specified TV show.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the TV show.",
                    required: true,
                },
            ],
        });

        // Hard coded genre IDs because they are not likely to change for v3 and
        // dynamically getting them would mean sending another request, since
        // it's a seperate endpoint.
        this.genres = { "10759": "Action & Adventure", "16": "Animation", "35": "Comedy", "80": "Crime", "99": "Documentary", "18": "Drama", "10751": "Family", "10762": "Kids", "9648": "Mystery", "10763": "News", "10764": "Reality", "10765": "Sci-Fi & Fantasy", "10766": "Soap", "10767": "Talk", "10768": "War & Politics", "37": "Western" };
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");

        // fetch tv shows
        const { body } = await requests.get("https://api.themoviedb.org/3/search/tv?" + new URLSearchParams({
            api_key: ((interaction.client as Client).settings as bastion.Settings)?.tmdbApiKey,
            query: name,
        }));
        const results: TVShowResponse = await body.json();

        // filter adult shows if it's not an nsfw channels
        const tvShows = (interaction.channel as Exclude<GuildTextBasedChannel, ThreadChannel>).nsfw ? results?.results : results?.results?.filter(tv => !tv.adult);

        if (tvShows?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: tvShows[0].name,
                        url: "https://themoviedb.org/tv/" + tvShows[0].id,
                        description: tvShows[0].overview,
                        fields: [
                            {
                                name: "Genre",
                                value: tvShows[0].genre_ids.map(id => this.genres[id]).join("\n"),
                                inline: true,
                            },
                            {
                                name: "Language",
                                value: tvShows[0].original_language.toUpperCase(),
                                inline: true,
                            },
                            {
                                name: "Rating",
                                value: `${tvShows[0].vote_average}`,
                                inline: true,
                            },
                            {
                                name: "First Air Date",
                                value: tvShows[0].first_air_date,
                                inline: true,
                            },
                        ],
                        image: {
                            url: tvShows[0].poster_path ? "https://image.tmdb.org/t/p/original" + tvShows[0].poster_path : "https://image.tmdb.org/t/p/original" + tvShows[0].backdrop_path,
                        },
                        footer: {
                            text: "Powered by The Movie Database",
                            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tmdb.new.logo.svg/320px-Tmdb.new.logo.svg.png",
                        },
                    },
                ],
            });
        }

        await interaction.editReply(`I didn't find any TV show for **${ name }**.`);
    }
}

export = TVCommand;
