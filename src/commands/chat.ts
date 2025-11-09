/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Settings from "../utils/settings.js";

const buildSystemPrompt = (guild: string, channel: string, user: string): string =>
    [
        `You are Bastion, a helpful Discord bot in ${ guild } (#${ channel }).`,
        "Participate naturally. Keep it casual and direct—Discord style, not email.",
        "Keep replies very short: 1-2 short sentences. Only expand if asked.",
        "If listing, keep it minimal and compact.",
        "History may include \"Name: message\" lines to show speakers.",
        "CRITICAL: Never start with a name/label. Don't mirror \"Name: message\". Start directly with your content.",
        `If you need to address someone, mention their name inline (not as a leading label). Prefer second-person when talking to ${ user }.`,
        "Server/channel names are themes only. Don't infer real-world context/capabilities from them.",
        "No roleplay or claims of control unless explicitly given. Ask a brief clarifying question if context is ambiguous.",
        "Avoid boilerplate and unnecessary apologies.",
    ].join(" ");

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

        const systemPrompt = buildSystemPrompt(
            interaction.guild.name,
            interaction.channel.name,
            interaction.member.displayName
        );
        const messages = await interaction.channel.messages.fetch({ limit: 10 }).catch(Logger.ignore);
        const ordered = messages ? [ ...messages.values() ].sort((a, b) => a.createdTimestamp - b.createdTimestamp) : [];
        const history = ordered ? ordered.filter(m => m.content).map(m => ({
            role: m.author.id === interaction.client.user.id ? "assistant" : "user" as "user" | "assistant",
            content: m.author.id === interaction.client.user.id ? m.cleanContent : `${ m.member.displayName || m.author.displayName }: ${ m.cleanContent }`,
        })) : [];

        // if first message is from the bot, remove it
        if (history[0]?.role === "assistant") history.shift();

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
                    ...history.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    {
                        role: "user",
                        content: `${ interaction.member.displayName }: ${ message }`,
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
                systemInstruction: systemPrompt,
            });

            const chat = geminiModel.startChat({
                history: history.map(m => ({
                    role: m.role === "assistant" ? "model" : m.role,
                    parts: [{ text: m.content }],
                })),
            });
            const result = await chat.sendMessage(`${ interaction.member.displayName }: ${ message }`);

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
                system: systemPrompt,
                messages: [
                    ...history.map(m => ({
                        role: m.role,
                        content: [{ type: "text" as const, text: m.content }],
                    })),
                    {
                        role: "user",
                        content: [{ type: "text", text: `${ interaction.member.displayName }: ${ message }` }],
                    },
                ],
                metadata: {
                    user_id: interaction.member.id,
                },
            });

            return await interaction.editReply({
                content: result.content[0].type === "text" ? result.content[0].text : "...",
            });
        }

        return await interaction.editReply({
            content: "You haven't set up API keys for any gen AI APIs.",
        });
    }
}

export { ChatCommand as Command };
