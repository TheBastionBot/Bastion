/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildTextBasedChannel, ThreadChannel } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { bastion } from "../../types.js";
import { COLORS } from "../../utils/constants.js";

interface Movie {
    id: number;
    popularity: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
    adult: false;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    title: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

interface MovieResponse {
    page: number;
    total_results: number;
    total_pages: number;
    results: Movie[];
}

class MovieCommand extends Command {
    private genres: { [key: string]: string };

    constructor() {
        super({
            name: "movie",
            description: "Searches for information on the specified movie.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the movie.",
                    required: true,
                },
            ],
        });

        // Hard coded genre IDs because they are not likely to change for v3 and
        // dynamically getting them would mean sending another request, since
        // it's a seperate endpoint.
        this.genres = { "28": "Action", "12": "Adventure", "16": "Animation", "35": "Comedy", "80": "Crime", "99": "Documentary", "18": "Drama", "10751": "Family", "14": "Fantasy", "36": "History", "27": "Horror", "10402": "Music", "9648": "Mystery", "10749": "Romance", "878": "Science Fiction", "10770": "TV Movie", "53": "Thriller", "10752": "War", "37": "Western" };
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");

        // fetch movies
        const { body } = await requests.get("https://api.themoviedb.org/3/search/movie?" + new URLSearchParams({
            api_key: ((interaction.client as Client).settings as bastion.Settings)?.tmdbApiKey,
            query: name,
        }));
        const results: MovieResponse = await body.json();

        // filter adult shows if it's not an nsfw channels
        const movies = (interaction.channel as Exclude<GuildTextBasedChannel, ThreadChannel>).nsfw ? results?.results : results?.results?.filter(movie => !movie.adult);

        if (movies?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: movies[0].title,
                        url: "https://themoviedb.org/movie/" + movies[0].id,
                        description: movies[0].overview,
                        fields: [
                            {
                                name: "Genre",
                                value: movies[0].genre_ids.map(id => this.genres[id]).join("\n"),
                                inline: true,
                            },
                            {
                                name: "Language",
                                value: movies[0].original_language.toUpperCase(),
                                inline: true,
                            },
                            {
                                name: "Rating",
                                value: `${movies[0].vote_average}`,
                                inline: true,
                            },
                            {
                                name: "Release Date",
                                value: movies[0].release_date,
                                inline: true,
                            },
                        ],
                        image: {
                            url: movies[0].poster_path ? "https://image.tmdb.org/t/p/original" + movies[0].poster_path : "https://image.tmdb.org/t/p/original" + movies[0].backdrop_path,
                        },
                        footer: {
                            text: "Powered by The Movie Database",
                            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tmdb.new.logo.svg/320px-Tmdb.new.logo.svg.png",
                        },
                    },
                ],
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "movie",
            query: name,
        }));
    }
}

export { MovieCommand as Command };
