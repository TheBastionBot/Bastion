/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { inspect } from "util";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class EvalCommand extends Command {
    constructor() {
        super({
            name: "eval",
            description: "Evaluate JavaScript code in Bastion's context.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "code",
                    description: "The code you want to execute.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "public",
                    description: "Display the output to everyone.",
                },
            ],
            owner: true,
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const code = interaction.options.getString("code");
        const isPublic = interaction.options.getBoolean("public");

        // evaluate the code
        let stdout: string, stderr: string;

        try {
            stdout = eval(code);
            if (typeof stdout !== "string") stdout = inspect(stdout);
        } catch (e) {
            stderr = e.toString();
        }

        await interaction.reply({
            content: `\`\`\`js\n${ stderr || stdout || "Successfully evaluated the code." }\`\`\``,
            ephemeral: !isPublic,
        });
    }
}

export = EvalCommand;
