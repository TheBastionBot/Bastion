/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";
import OpenAI from "openai";

import Settings from "../../utils/settings.js";

class ImageGenerateCommand extends Command {
    constructor() {
        super({
            name: "generate",
            description: "Generate an image with DALL-E from OpenAI.",
            owner: true,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "prompt",
                    description: "A description of the desired image.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "size",
                    description: "The size of the generated image.",
                    choices: [
                        {
                            name: "Square",
                            value: "1024x1024",
                        },
                        {
                            name: "Portrait",
                            value: "1024x1792",
                        },
                        {
                            name: "Landscape",
                            value: "1792x1024",
                        },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();

        const prompt = interaction.options.getString("prompt");
        const size = interaction.options.getString("size") as "1024x1024" | "1024x1792" | "1792x1024" || "1024x1024";

        const openai = new OpenAI({
            apiKey: ((interaction.client as Client).settings as Settings).get("openai").apiKey,
        });

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            response_format: "url",
            size: size,
            user: interaction.member.id,
        });

        await interaction.editReply({
            content: response.data[0].revised_prompt,
            files: [{
                attachment: response.data[0].url,
            }],
        });
    }
}

export { ImageGenerateCommand as Command };
