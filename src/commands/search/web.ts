/*!
 * @author TRACTION (iamtraction)
 * @copyright 2025
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";
import Settings from "../../utils/settings.js";

declare interface TavilyResponse {
    query: string;
    answer: string;
    images: {
        url: string;
        description?: string;
    }[];
    results: {
        title: string;
        url: string;
        content: string;
        score: number;
        raw_content: string | null;
        favicon: string;
    }[];
    auto_parameters: {
        topic: "general" | "news" | "finance";
        search_depth: string;
    };
    response_time: number;
    request_id: string;
}

class WebCommand extends Command {
    constructor() {
        super({
            name: "web",
            description: "Searches the web for the specified query.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "query",
                    description: "The query you want to search for.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "freshness",
                    description: "Specifies the time range for search results.",
                    choices: [
                        { name: "Past day", value: "d" },
                        { name: "Past week", value: "w" },
                        { name: "Past month", value: "m" },
                        { name: "Past year", value: "y" },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "topic",
                    description: "Specifies the category of the search.",
                    choices: [
                        { name: "General", value: "general" },
                        { name: "News", value: "news" },
                        { name: "Finance", value: "finance" },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const query = interaction.options.getString("query");
        const freshness = interaction.options.getString("freshness") || undefined;
        const topic = interaction.options.getString("topic") || undefined;

        const apiKey = ((interaction.client as Client).settings as Settings)?.get("tavilyApiKey");

        if (!apiKey) {
            return await interaction.reply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "commndMissingRequirements"),
                ephemeral: true,
            });
        }

        // fetch web search results
        const { body } = await requests.post(
            "https://api.tavily.com/search",
            {
                "authorization": `Bearer ${ ((interaction.client as Client).settings as Settings)?.get("tavilyApiKey") }`,
            },
            null,
            {
                query,
                include_answer: true,
                freshness,
                topic,
            },
        );

        const data = await body.json() as TavilyResponse;

        await interaction.editReply({
            content: `${ data.answer }

-# **${ data.results.length } Sources** in \`${ data.response_time }s\`
${ data.results.map(result => `- -# [**${ result.title }**](<${ result.url }>)`).join("\n") }`,
        });
    }
}

export { WebCommand as Command };
