/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";

class PauseCommand extends Command {
    constructor() {
        super({
            name: "pause",
            description: "Pause the music playback in the voice channel.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        if (studio?.player?.state?.status === AudioPlayerStatus.Playing) {
            const paused = studio.player.pause();
            return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, paused ? "musicPause" : "musicPauseError", { song: (studio.player.state.resource?.metadata as music.Song)?.name }));
        }
        await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicPlayingNothing"), ephemeral: true });
    }
}

export = PauseCommand;
