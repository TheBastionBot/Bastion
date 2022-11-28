/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";

class StopCommand extends Command {
    constructor() {
        super({
            name: "stop",
            description: "Stop the music playback and disconnect from the voice channel.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);
        if (studio) {
            // clear the music queue
            studio.queue = [];
            // stop audio player
            studio?.player?.stop();
        } else {
            // destroy voice connection
            getVoiceConnection(interaction.guildId)?.destroy();
        }

        await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "musicStop"));
    }
}

export = StopCommand;
