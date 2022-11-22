/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class SayCommand extends Command {
    constructor() {
        super({
            name: "say",
            description: "Replies with the message you ask it to say.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The message you want Bastion to say.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply(interaction.options.getString("message"));
    }
}

export = SayCommand;
