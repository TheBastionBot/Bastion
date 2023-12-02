/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import OpenAI from "openai";

import Settings from "../utils/settings.js";

class ChatCommand extends Command {
    constructor() {
        super({
            name: "chat",
            description: "Ask questions or chat with ChatGPT from OpenAI.",
            owner: true,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "Your message.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();

        const message = interaction.options.getString("message");

        const openai = new OpenAI({
            apiKey: ((interaction.client as Client).settings as Settings).get("openai").apiKey,
        });

        const response = await openai.chat.completions.create({
            model: ((interaction.client as Client).settings as Settings).get("openai").model || "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            max_tokens: ((interaction.client as Client).settings as Settings).get("openai").maxTokens || 100,
            user: interaction.member.id,
        });

        await interaction.editReply({
            content: response.choices[0].message.content,
        });
    }
}

export { ChatCommand as Command };
