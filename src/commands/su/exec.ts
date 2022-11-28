/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { promisify } from "util";
import { exec as exe } from "child_process";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

const exec = promisify(exe);

class ExecCommand extends Command {
    constructor() {
        super({
            name: "exec",
            description: "Execute terminal commands on the system where Bastion is running.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "command",
                    description: "The command you want to execute.",
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
        const command = interaction.options.getString("command");
        const isPublic = interaction.options.getBoolean("public");

        // execute the command
        let stdout: string, stderr: string;

        // execute the command
        await exec(command, { timeout: 6e4 })
            .then(result => {
                if (result.stdout) stdout = result.stdout;
                if (result.stderr) stderr = result.stderr;
            })
            .catch(error => {
                if (error.stdout) stdout = error.stdout;
                if (error.stderr) stderr = error.stderr;

                if (!error.stdout && !error.stderr) stderr = "# TIMED OUT";
            });

        await interaction.reply({
            content: `\`\`\`bash\n${ stderr || stdout || (interaction.client as Client).locales.getText(interaction.guildLocale, "execSuccess") }\`\`\``,
            ephemeral: !isPublic,
        });
    }
}

export = ExecCommand;
