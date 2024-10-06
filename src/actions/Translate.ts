/*!
 * @author TRACTION (iamtraction)
 * @copyright 2024
 */
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import translate = require("@iamtraction/google-translate");

class TranslateCommand extends Command {
    constructor() {
        super({
            type: ApplicationCommandType.Message,
            name: "Translate",
            description: "",
        });
    }

    public async exec(interaction: MessageContextMenuCommandInteraction<"cached">): Promise<unknown> {
        if (!interaction.targetMessage.content) return;

        // fetch the translation
        const response = await translate(interaction.targetMessage.content, { to: "en" });

        return await interaction.reply({
            content: `${ response.text }
-# Translated from ${ response.from.language.iso?.toUpperCase() } to English`,
        });
    }
}

export { TranslateCommand as Command };
