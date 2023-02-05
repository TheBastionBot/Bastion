/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { StringSelectMenuInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class MusicPausePlayButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.MusicPausePlayButton,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<void> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        // pause/unpause the player
        if (studio?.player?.state?.status === AudioPlayerStatus.Playing) {
            studio.player.pause();
        } else if (studio?.player?.state?.status === AudioPlayerStatus.Paused || studio?.player?.state?.status === AudioPlayerStatus.AutoPaused) {
            studio.player.unpause();
        }

        await interaction.deferUpdate();
    }
}

export { MusicPausePlayButton as MessageComponent };
