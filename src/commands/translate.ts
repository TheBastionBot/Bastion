/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import translate = require("@iamtraction/google-translate");

class TranslateCommand extends Command {
    constructor() {
        super({
            name: "translate",
            description: "Translates the specified text from one language to another.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "text",
                    description: "The text you want to translate.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "to",
                    description: "The language you want to translate to.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "from",
                    description: "The language you want to translate from.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const text = interaction.options.getString("text");
        const to = interaction.options.getString("to") || "en";
        const from = interaction.options.getString("from") || "auto";

        // fetch the translation
        const response = await translate(text, { from, to });

        await interaction.editReply(response.text);
    }
}

export { TranslateCommand as Command };
