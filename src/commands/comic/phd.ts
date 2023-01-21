/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { JSDOM } from "jsdom";
import { Client, Command } from "@bastion/tesseract";

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

        const images = [];
        for (const element of document?.getElementsByName("comic2")?.values() || []) {
            const imageUrl = element?.getAttribute("src");
            if (imageUrl) images.push(imageUrl);
        }

        if (images.length) {
            return await interaction.editReply({
                content: `[PHD Comics${ issue ? `#${ issue }` : "" }](<${ comicURL }>)`,
                files: images.slice(0, 10).map(i => ({ name: i?.split("/").pop(), attachment: i })),
            });
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "comicNotFound"));
    }
}

export = PHDCommand;
