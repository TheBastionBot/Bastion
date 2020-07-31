/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class MangaCommand extends Command {
    constructor() {
        super("manga", {
            description: "It allows you to search for information on the specified manga.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "manga TITLE",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 2000 ? string.slice(0, 2000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the title to search
        const title = argv._.join(" ");

        // fetch manga data
        const response = await omnic.makeRequest("/kitsu/manga/" + encodeURIComponent(title));
        const results: {
            data: {
                attributes: {
                    titles: { [key: string]: string };
                    slug: string;
                    synopsis: string;
                    startDate: string;
                    endDate: string;
                    posterImage: {
                        original: string;
                    };
                };
            }[];
        } = await response.json();

        // check for errors
        if (!results || !results.data || !results.data.length) throw new Error("NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Manga",
                },
                title: Object.values(results.data[0].attributes.titles)[0],
                url: "https://kitsu.io/manga/" + results.data[0].attributes.slug,
                description: this.sanitize(results.data[0].attributes.synopsis),
                fields: [
                    {
                        name: "Status",
                        value: results.data[0].attributes.endDate ? "Finished" : "Publishing",
                        inline: true,
                    },
                    {
                        name: "Published",
                        value: results.data[0].attributes.endDate ? results.data[0].attributes.startDate + " - " + results.data[0].attributes.endDate : results.data[0].attributes.startDate + " - Present",
                        inline: true,
                    },
                ],
                image: {
                    url: results.data[0].attributes.posterImage.original,
                },
                footer: {
                    text: "Powered by Kitsu",
                },
            },
        });
    }
}
