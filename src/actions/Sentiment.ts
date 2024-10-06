/*!
 * @author TRACTION (iamtraction)
 * @copyright 2024
 */
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Settings from "../utils/settings.js";

class SentimentCommand extends Command {
    constructor() {
        super({
            type: ApplicationCommandType.Message,
            name: "Sentiment",
            description: "",
            owner: true,
        });
    }

    public async exec(interaction: MessageContextMenuCommandInteraction<"cached">): Promise<unknown> {
        if (!interaction.targetMessage.content) return;

        const systemPrompt = "You are a helpful and informative AI assistant. You will analyze the given text and provide an assessment of its sentiment. Consider the overall tone, specific words and phrases used, and any contextual clues. Your response should be short, concise, objective, and informative.";
        const sentimentPrompt = `Please analyze the following text and provide a assessment of its sentiment: ${ interaction.targetMessage.content }`;

        // use ChatGPT if OpenAI API key is present
        if (((interaction.client as Client).settings as Settings).get("openai").apiKey) {
            const openai = new OpenAI({
                apiKey: ((interaction.client as Client).settings as Settings).get("openai").apiKey,
            });

            const response = await openai.chat.completions.create({
                model: ((interaction.client as Client).settings as Settings).get("openai").model,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: sentimentPrompt,
                    },
                ],
                max_tokens: ((interaction.client as Client).settings as Settings).get("openai").maxTokens,
                user: interaction.member.id,
            });

            return await interaction.reply({
                content: response.choices[0].message.content,
                ephemeral: true,
            });
        }

        // use Gemini if Gemini API key is present
        if (((interaction.client as Client).settings as Settings).get("gemini").apiKey) {
            const gemini = new GoogleGenerativeAI(((interaction.client as Client).settings as Settings).get("gemini").apiKey);
            const geminiModel = gemini.getGenerativeModel({
                model: ((interaction.client as Client).settings as Settings).get("gemini").model,
                systemInstruction: systemPrompt,
                generationConfig: {
                    maxOutputTokens: ((interaction.client as Client).settings as Settings).get("gemini").maxOutputTokens,
                },
            });

            const result = await geminiModel.generateContent(sentimentPrompt);

            return await interaction.reply({
                content: result.response.text(),
                ephemeral: true,
            });
        }

        // use Claude if Anthropic API key is present
        if (((interaction.client as Client).settings as Settings).get("anthropic").apiKey) {
            const anthropic = new Anthropic({
                apiKey: ((interaction.client as Client).settings as Settings).get("anthropic").apiKey,
            });

            const result = await anthropic.messages.create({
                model: ((interaction.client as Client).settings as Settings).get("anthropic").model,
                system: systemPrompt,
                max_tokens: ((interaction.client as Client).settings as Settings).get("anthropic").maxTokens,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: sentimentPrompt,
                            },
                        ],
                    },
                ],
                metadata: {
                    user_id: interaction.member.id,
                },
            });

            return await interaction.reply({
                content: result.content[0].type === "text" && result.content[0].text,
                ephemeral: true,
            });
        }
    }
}

export { SentimentCommand as Command };
