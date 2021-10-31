/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";
import { BastionCredentials } from "../../typings/settings";

export = class GameCommand extends Command {
    constructor() {
        super("game", {
            description: "It allows you to search for information on the specified game.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "game TITLE",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 2000 ? string.slice(0, 2000) + "\n..." : string;
    };

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the title to search
        const title = argv._.join(" ");

        // fetch game data
        const response = await requests.post("https://api.igdb.com/v4/games?" + new URLSearchParams({
            fields: "*, alternative_names.*, artworks.*, cover.*, genres.*, platforms.*, screenshots.*, videos.*, websites.*",
            limit: "10",
            search: title,
        }), {
            "Authorization": "Bearer " + (this.client.credentials as BastionCredentials).twitch.accessToken,
            "Client-ID": (this.client.credentials as BastionCredentials).twitch.clientId,
        });
        const game: {
            alternative_names: string[];
            artworks: string[];
            cover: {
                url: string;
            };
            first_release_date: number;
            game_modes: number[];
            genres: string[];
            name: string;
            platforms: string[];
            screenshots: [];
            summary: string;
            total_rating: number;
            url: string;
            version_title: string;
            websites: {
                url: string;
            }[];
        }[] = await response.json();

        if (!game.length) throw new Error("NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: game[0].version_title,
                },
                title: game[0].name,
                url: game[0].url,
                description: this.sanitize(game[0].summary),
                fields: [
                    {
                        name: "Rating",
                        value: game[0].total_rating ? game[0].total_rating.toFixed(2) : "-",
                        inline: true,
                    },
                    {
                        name: "Release Date",
                        value: game[0].first_release_date ? new Date(game[0].first_release_date * 1000).toDateString() : "-",
                        inline: true,
                    },
                    {
                        name: "Links",
                        value: game[0].websites?.map(site => site?.url)?.join("\n") || "-",
                    },
                ],
                image: {
                    url: game[0].cover?.url?.startsWith("//") ? "https:" + game[0].cover.url.replace("t_thumb", "t_cover_big") : "",
                },
                footer: {
                    text: "Powered by Twitch",
                },
            },
        });
    };
}
