/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";

interface Wiki {
    title: string;
    extract: string;
    fullurl: string;
    thumbnail: {
        source: string;
    };
}

interface WikipediaResponse {
    query: {
        pages: Wiki[];
    };
}

class WikipediaCommand extends Command {
    constructor() {
        super({
            name: "wikipedia",
            description: "Searches Wikipedia for the specified query.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "query",
                    description: "The search query.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const query = interaction.options.getString("query");

        // fetch results from wikipedia
        const { body } = await requests.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|info|pageimages&exsentences=10&exintro=true&explaintext=true&inprop=url&pithumbsize=512&redirects=1&formatversion=2&titles=${ query }`);
        const wiki: WikipediaResponse = await body.json();

        if (wiki.query?.pages?.length) {
            return await interaction.editReply(`[${ wiki.query.pages[0].title }](<${ wiki.query.pages[0].fullurl }>) — ${ wiki.query.pages[0].extract }`);
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "Wikipedia article",
            query,
        }));
    }
}

export = WikipediaCommand;
