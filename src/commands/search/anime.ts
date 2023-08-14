/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";

interface Anime {
    titles: { [key: string]: string };
    slug: string;
    synopsis: string;
    startDate: string;
    endDate: string;
    ageRating: string;
    ageRatingGuide: string;
    nsfw: boolean;
    posterImage: {
        original: string;
    };
}

interface AnimeResponse {
    data?: {
        attributes: Anime;
    }[];
}

class AnimeCommand extends Command {
    constructor() {
        super({
            name: "anime",
            description: "Searches for information on the specified anime.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the anime.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");

        // fetch anime
        const { body } = await requests.get("https://kitsu.io/api/edge/anime?" + new URLSearchParams({
            "fields[anime]": "titles,slug,synopsis,startDate,endDate,ageRating,ageRatingGuide,nsfw,posterImage",
            "filter[text]": name,
        }), { accept: "application/vnd.api+json" });
        const results: AnimeResponse = await body.json();

        if (results?.data?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: Object.values(results.data[0].attributes.titles)[0],
                        url: "https://kitsu.io/anime/" + results.data[0].attributes.slug,
                        description: results.data[0].attributes.synopsis,
                        fields: [
                            {
                                name: "Status",
                                value: results.data[0].attributes.endDate ? "Finished" : "Airing",
                                inline: true,
                            },
                            {
                                name: "Aired",
                                value: results.data[0].attributes.endDate ? results.data[0].attributes.startDate + " — " + results.data[0].attributes.endDate : results.data[0].attributes.startDate + " — Present",
                                inline: true,
                            },
                            {
                                name: "Rating",
                                value: results.data[0].attributes.ageRating + " — " + results.data[0].attributes.ageRatingGuide + " " + (results.data[0].attributes.nsfw ? "[NSFW]" : ""),
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
                ],
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "anime",
            query: name,
        }));
    }
}

export { AnimeCommand as Command };
