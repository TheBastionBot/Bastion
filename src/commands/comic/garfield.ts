/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { JSDOM } from "jsdom";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";

class GarfieldCommand extends Command {
    constructor() {
        super({
            name: "garfield",
            description: "Check the latest Garfield comic.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const { body } = await requests.get("https://www.arcamax.com/thefunnies/garfield/");
        const html = await body.text();

        const { document } = new JSDOM(html).window;

        const comic = [ ...document.querySelectorAll("img.the-comic") ].find(image => image.getAttribute("alt")?.startsWith("Garfield for"));
        const source = comic?.getAttribute("src");

        if (!source) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "comicNotFound"));
        }

        const date = comic.getAttribute("alt").replace(/^Garfield for /, "");

        return await interaction.editReply([
            `[Garfield by Jim Davis for ${ date }](<https://www.arcamax.com/thefunnies/garfield/>)`,
            source,
        ].join("\n"));
    }
}

export { GarfieldCommand as Command };
