/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Settings from "../utils/settings.js";

class ChatCommand extends Command {
    constructor() {
        super({
            name: "chat",
            description: "Ask questions or chat with Bastion.",
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

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const message = interaction.options.getString("message");

        // use ChatGPT if OpenAI API key is present
        if (((interaction.client as Client).settings as Settings).get("openai").apiKey) {
            const openai = new OpenAI({
                apiKey: ((interaction.client as Client).settings as Settings).get("openai").apiKey,
            });

            const response = await openai.chat.completions.create({
                model: ((interaction.client as Client).settings as Settings).get("openai").model,
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
                max_tokens: ((interaction.client as Client).settings as Settings).get("openai").maxTokens || 100,
                user: interaction.member.id,
            });

            return await interaction.editReply({
                content: response.choices[0].message.content,
            });
        }

        // use Gemini if Gemini API key is present
        if (((interaction.client as Client).settings as Settings).get("gemini").apiKey) {
            const gemini = new GoogleGenerativeAI(((interaction.client as Client).settings as Settings).get("gemini").apiKey);
            const geminiModel = gemini.getGenerativeModel({
                model: ((interaction.client as Client).settings as Settings).get("gemini").model,
                generationConfig: {
                    maxOutputTokens: ((interaction.client as Client).settings as Settings).get("gemini").maxOutputTokens,
                },
            });

            const result = await geminiModel.generateContent(message);

            return await interaction.editReply({
                content: result.response.text(),
            });
        }

        // use Claude if Anthropic API key is present
        if (((interaction.client as Client).settings as Settings).get("anthropic").apiKey) {
            const anthropic = new Anthropic({
                apiKey: ((interaction.client as Client).settings as Settings).get("anthropic").apiKey,
            });

            const result = await anthropic.messages.create({
                model: ((interaction.client as Client).settings as Settings).get("anthropic").model,
                max_tokens: ((interaction.client as Client).settings as Settings).get("anthropic").maxTokens,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: message,
                            },
                        ],
                    },
                ],
            });

            return await interaction.editReply({
                content: result.content[0].type === "text" && result.content[0].text,
            });
        }

        return await interaction.editReply({
            content: "You haven't set up API keys for any gen AI APIs.",
        });
    }
}

export { ChatCommand as Command };
