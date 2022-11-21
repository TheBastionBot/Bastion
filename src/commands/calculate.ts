/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import * as math from "mathjs";
import { Command } from "@bastion/tesseract";

import sanitizeMessage from "../utils/sanitizeMessage";

class CalculateCommand extends Command {
    constructor() {
        super({
            name: "calculate",
            description: "Evaluates the specified mathematical expression.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "expression",
                    description: "The expression you want to evaluate.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const expression = interaction.options.getString("expression");

        let stdout: string, stderr: string;

        // evaluate the expression
        try {
            stdout = math.evaluate(expression).toString();
        } catch (e) {
            stderr = e.toString();
        }

        if (stderr) {
            return await interaction.reply({
                content: `\`\`\`js\n${ sanitizeMessage(stderr, 2000 - 9) }\`\`\``,
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: sanitizeMessage(stdout),
        });
    }
}

export = CalculateCommand;
