/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import * as requests from "../../utils/requests.js";

interface XKCD {
    title: string;
    safe_title?: string;
    alt: string;
    num: string;
    day: number;
    month: number;
    year: number;
    img: string;
}

class XKCDCommand extends Command {
    constructor() {
        super({
            name: "xkcd",
            description: "Check the latest xkcd comic, or the specified issue.",
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

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const issue = interaction.options.getInteger("issue");

        // fetch the comic
        const { body } = await requests.get(`https://xkcd.com${ issue ? `/${ issue }` : "" }/info.0.json`);
        const xkcd: XKCD = await body.json();

        await interaction.editReply({
            content: `[xkcd #${ xkcd.num }](<https://www.explainxkcd.com/wiki/index.php/${ xkcd.num }>) — ${ xkcd.safe_title || xkcd.title } — ${ xkcd.alt }`,
            files: [{
                name: `${ xkcd.num }.png`,
                attachment: xkcd.img,
            }],
        });
    }
}

export { XKCDCommand as Command };
