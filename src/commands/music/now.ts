/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ChatInputCommandInteraction, ComponentType } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, Command } from "@bastion/tesseract";
import { music } from "@bastion/tesseract/typings/types";
import MessageComponents from "../../utils/components";

class NowCommand extends Command {
    constructor() {
        super({
            name: "now",
            description: "Shows the song playing right now.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        if (studio?.player?.state?.status === AudioPlayerStatus.Playing || studio?.player?.state?.status === AudioPlayerStatus.Paused || studio?.player?.state?.status === AudioPlayerStatus.AutoPaused) {
            return await interaction.reply({
                content: `**${ (studio.player.state.resource?.metadata as music.Song)?.name }**`,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                custom_id: MessageComponents.MusicPausePlayButton,
                                type: ComponentType.Button,
                                label: "Pause / Resume",
                                style: ButtonStyle.Primary,
                            },
                            {
                                custom_id: MessageComponents.MusicSkipButton,
                                type: ComponentType.Button,
                                label: "Skip",
                                style: ButtonStyle.Secondary,
                            },
                        ],
                    },
                ],
            });
        }
        await interaction.reply({ content: (interaction.client as Client).locales.getText(interaction.guildLocale, "musicPlayingNothing"), ephemeral: true });
    }
}

export = NowCommand;
