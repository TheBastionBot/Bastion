/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";
import { bastion } from "../../types";

interface Definition {
    id?: string;
    partOfSpeech?: string;
    attributionText?: string;
    sourceDictionary?: string;
    text?: string;
    sequence?: string;
    score?: number;
    word?: string;
    attributionUrl?: string;
    wordnikUrl?: string;
    citations?: [];
    exampleUses?: [];
    labels?: [];
    notes?: [];
    relatedWords?: [];
    textProns?: [];
}

class DefinitionsCommand extends Command {
    constructor() {
        super({
            name: "definitions",
            description: "Displays the definitions for the specified word.",
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

        // fetch definitions
        const { body } = await requests.get(`https://api.wordnik.com/v4/word.json/${ encodeURIComponent(word.toLowerCase()) }/definitions?limit=10&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${ ((interaction.client as Client).settings as bastion.Settings)?.wordnikApiKey }`);
        const definitions: Definition[] = await body.json();

        if (definitions?.length) {
            return await interaction.editReply(
                definitions
                .filter(definition => definition.partOfSpeech && definition.text)
                .slice(0, 3)
                .map(definition => (`***${ definition.partOfSpeech }*** ${ definition.text }`))
                .join("\n")
            );
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "searchNotFound", {
            item: "definition",
            query: word,
        }));
    }
}

export = DefinitionsCommand;
