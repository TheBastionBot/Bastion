/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class MovieCommand extends Command {
    private genres: { [key: string]: string };

    constructor() {
        super("movie", {
            description: "It allows you to search for information on the specified movie.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "movie TITLE",
            ],
        });

        // Hard coded genre IDs because they are not likely to change for v3 and
        // dynamically getting them would mean sending another request, since
        // it's a seperate endpoint.
        this.genres = { "28": "Action", "12": "Adventure", "16": "Animation", "35": "Comedy", "80": "Crime", "99": "Documentary", "18": "Drama", "10751": "Family", "14": "Fantasy", "36": "History", "27": "Horror", "10402": "Music", "9648": "Mystery", "10749": "Romance", "878": "Science Fiction", "10770": "TV Movie", "53": "Thriller", "10752": "War", "37": "Western" };
    }

    sanitize = (string: string): string => {
        return string.length > 2000 ? string.slice(0, 2000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        // identify the title to search
        const title = argv._.join(" ");

        // fetch movie data
        const response = await omnic.makeRequest("/tmdb/movies/" + title);
        const movies: {
            page: number;
            total_results: number;
            total_pages: number;
            results: {
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
            }[];
        } = await response.json();

        const results = (message.channel as TextChannel).nsfw ? movies.results : movies.results.filter(movie => !movie.adult);

        // check for errors
        if (!results || !results.length) throw new Error("NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Movie",
                },
                title: results[0].title,
                url: "https://themoviedb.org/movie/" + results[0].id,
                description: this.sanitize(results[0].overview),
                fields: [
                    {
                        name: "Genre",
                        value: results[0].genre_ids.map(id => this.genres[id]).join("\n"),
                        inline: true,
                    },
                    {
                        name: "Language",
                        value: results[0].original_language.toUpperCase(),
                        inline: true,
                    },
                    {
                        name: "Rating",
                        value: `${results[0].vote_average}`,
                        inline: true,
                    },
                    {
                        name: "Release Date",
                        value: results[0].release_date,
                        inline: true,
                    },
                ],
                image: {
                    url: results[0].poster_path ? "https://image.tmdb.org/t/p/original" + results[0].poster_path : "https://image.tmdb.org/t/p/original" + results[0].backdrop_path,
                },
                footer: {
                    text: "Powered by The Movie Database",
                },
            },
        });
    }
}
