/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ChangesCommand extends Command {
    constructor() {
        super({
            name: "changes",
            description: "See the changes introduced in the current version of Bastion.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply(`${ (interaction.client as Client).locales.getText(interaction.guildLocale, "changes", { version: `Bastion v${ process.env.npm_package_version }` }) } — https://github.com/TheBastionBot/Bastion/releases/tag/v${ process.env.npm_package_version }`);
    }
}

export = ChangesCommand;
