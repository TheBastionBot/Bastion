/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { JSDOM } from "jsdom";
import { Client, Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";

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

        const images: string[] = [];

        for (const element of document.querySelectorAll("img.img-responsive")) {
            const source = element.getAttribute("src");
            if (!source?.includes("/comics/archive/")) continue;

            const imageUrl = new URL(source, comicURL);

            // the hidden thumbnail leaks in with a malformed, extensionless source
            if (!/\.\w{3,4}$/.test(imageUrl.pathname)) continue;

            // the sources are linked over plain HTTP on the `www` host, which redirects
            if (/^(?:www\.)?phdcomics\.com$/.test(imageUrl.hostname)) {
                imageUrl.protocol = "https:";
                imageUrl.hostname = "phdcomics.com";
            }

            // the comic is duplicated for the responsive layouts
            if (!images.includes(imageUrl.href)) images.push(imageUrl.href);
        }

        if (images.length) {
            return await interaction.editReply([
                `[PHD Comics${ issue ? `#${ issue }` : "" }](<${ comicURL }>)`,
                ...images.slice(0, 5),
            ].join("\n"));
        }

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "comicNotFound"));
    }
}

export { PHDCommand as Command };
