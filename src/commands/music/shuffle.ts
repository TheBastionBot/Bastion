/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import * as arrays from "../../utils/arrays.js";

class ShuffleCommand extends Command {
    constructor() {
        super({
            name: "shuffle",
            description: "Shuffle the current music queue.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        // shuffle the music queue
        arrays.shuffle(studio.queue);

        if (studio?.queue?.length) {
            return await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueShuffle") });
        }

        await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueEmpty"), ephemeral: true });
    }
}

export { ShuffleCommand as Command };
