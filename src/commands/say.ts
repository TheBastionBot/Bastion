/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import { generate as generateEmbed } from "../utils/embeds";

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

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const message = generateEmbed(interaction.options.getString("message"));

        if (typeof message === "string") {
            return await interaction.reply(message);
        }
        return await interaction.reply({
            embeds: [ message ],
        });
    }
}

export = SayCommand;
