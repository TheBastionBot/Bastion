/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class GarfieldCommand extends Command {
    constructor() {
        super({
            name: "garfield",
            description: "Check the latest Garfield comic.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();

        // get today's date
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        await interaction.editReply({
            content: `Garfield Classics by Jim Davis for ${ date.toDateString() }`,
            files: [{
                name: "garfield.gif",
                attachment: `https://picayune.uclick.com/comics/ga/${ year }/ga${ String(year).slice(2) }${ month < 10 ? "0" + month : month }${ day < 10 ? "0" + day : day }.gif`,
            }],
        });
    }
}

export = GarfieldCommand;
