/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";

interface Definition {
    definition: string;
    permalink: string;
    thumbs_up: number;
    word: string;
    thumbs_down: number;
    written_on: string;
    example: string;
}

interface UrbanDictionaryResponse {
    list: Definition[];
}

class UrbanDictionaryCommand extends Command {
    constructor() {
        super({
            name: "urban-dictionary",
            description: "Searches Urban Dictionary for the specified word.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "word",
                    description: "The word you want to lookup.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const word = interaction.options.getString("word");

        // fetch results from urban dictionary
        const { body } = await requests.get(`https://api.urbandictionary.com/v0/define?term=${ encodeURIComponent(word) }`);
        const definitions: UrbanDictionaryResponse = await body.json();

        if (definitions?.list?.length) {
            return await interaction.editReply(`[${ definitions?.list[0].word }](<${ definitions.list[0].permalink }>) — ${ definitions.list[0].definition } **(${ (definitions.list[0].thumbs_up ?? 0) - (definitions.list[0].thumbs_down ?? 0) } votes)**`);
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "definition",
            query: word,
        }));
    }
}

export = UrbanDictionaryCommand;
