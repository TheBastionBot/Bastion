/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";

class SkipCommand extends Command {
    constructor() {
        super({
            name: "skip",
            description: "Skip the current music track that's being played in the voice channel.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        if (studio?.player?.state?.status) {
            if (studio.player.state.status === AudioPlayerStatus.Idle) {
                return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, "musicQueueNothingNext"));
            }
            const stopped = studio.player.stop();

            return await interaction.reply((interaction.client as Client).locales.getText(interaction.guildLocale, stopped ? "musicSkip" : "musicSkipError", { song: (studio.player.state.resource?.metadata as music.Song)?.name }));
        }

        await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicPlayingNothing"), ephemeral: true });
    }
}

export = SkipCommand;
