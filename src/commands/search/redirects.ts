/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";
import { fetch } from "undici";

class RedirectsCommand extends Command {
    constructor() {
        super({
            name: "redirects",
            description: "Follows all the redirects in the specified URL and displays the final URL.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "url",
                    description: "The URL you want to follow.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        let url = interaction.options.getString("url");

        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        const res = await fetch(url, { redirect: "follow" }).catch(Logger.ignore);

        return interaction.editReply(res ? res.url : (interaction.client as Client).locales.getText(interaction.guildLocale, "redirectsError"));
    }
}

export { RedirectsCommand as Command };
