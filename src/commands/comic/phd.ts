/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { JSDOM } from "jsdom";
import { Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests";

class PHDCommand extends Command {
    constructor() {
        super({
            name: "phd",
            description: "Check the latest PHD comic, or the specified issue.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "issue",
                    description: "Issue number to see the comic.",
                    min_value: 1,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const issue = interaction.options.getInteger("issue");

        const comicURL = `https://phdcomics.com${ issue ? "/comics/archive.php?comicid=" + issue : "" }`;

        // fetch the comic
        const { body } = await requests.get(comicURL);
        const html = await body.text();

        const { document } = new JSDOM(html).window;

        const image = document?.getElementById("comic2")?.getAttribute("src");

        if (image) {
            return await interaction.editReply({
                content: `[PHD Comics${ issue ? `#${ issue }` : "" }](<${ comicURL }>)`,
                files: [{
                    name: "phdcomics.png",
                    attachment: image,
                }],
            });
        }

        await interaction.editReply("I didn't find any comic. Please try again.");
    }
}

export = PHDCommand;
