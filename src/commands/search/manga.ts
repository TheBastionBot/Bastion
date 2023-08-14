/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import { COLORS } from "../../utils/constants.js";

interface Manga {
    titles: { [key: string]: string };
    slug: string;
    synopsis: string;
    startDate: string;
    endDate: string;
    posterImage: {
        original: string;
    };
}

interface MangaResponse {
    data?: {
        attributes: Manga;
    }[];
}

class MangaCommand extends Command {
    constructor() {
        super({
            name: "manga",
            description: "Searches for information on the specified manga.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the manga.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");

        // fetch manga
        const { body } = await requests.get("https://kitsu.io/api/edge/manga?" + new URLSearchParams({
            "fields[manga]": "titles,slug,synopsis,startDate,endDate,posterImage",
            "filter[text]": name,
        }), { accept: "application/vnd.api+json" });
        const results: MangaResponse = await body.json();

        if (results?.data?.length) {
            return await interaction.editReply({
                embeds: [
                    {
                        color: COLORS.PRIMARY,
                        title: Object.values(results.data[0].attributes.titles)[0],
                        url: "https://kitsu.io/manga/" + results.data[0].attributes.slug,
                        description: results.data[0].attributes.synopsis,
                        fields: [
                            {
                                name: "Status",
                                value: results.data[0].attributes.endDate ? "Finished" : "Publishing",
                                inline: true,
                            },
                            {
                                name: "Published",
                                value: results.data[0].attributes.endDate ? results.data[0].attributes.startDate + " — " + results.data[0].attributes.endDate : results.data[0].attributes.startDate + " — Present",
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
            item: "manga",
            query: name,
        }));
    }
}

export { MangaCommand as Command };
