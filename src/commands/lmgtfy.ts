/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class LMGTFYCommand extends Command {
    constructor() {
        super({
            name: "lmgtfy",
            description: "Send a LMGTFY link for the search query that teaches people how to do an internet search.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "query",
                    description: "The search query.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "site",
                    description: "The search engine to use.",
                    choices: [
                        { name: "DuckDuckGo", value: "d" },
                        { name: "Google", value: "g" },
                        { name: "Bing", value: "b" },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const query = interaction.options.getString("query");
        const site = interaction.options.getString("site");

        await interaction.reply("Let me search that for you... https://lmgtfy.com/?s=" + (site || "g") + "&q=" + encodeURIComponent(query));
    }
}

export = LMGTFYCommand;
