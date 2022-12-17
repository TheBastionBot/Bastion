/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { StringSelectMenuInteraction } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Client, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";

class MusicSkipButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.MusicSkipButton,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<void> {
        const studio = (interaction.client as Client).studio.get(interaction.guild);

        // skip the song
        if (studio?.player?.state?.status && studio.player.state.status !== AudioPlayerStatus.Idle) {
            studio.player.stop();
        }

        await interaction.deferUpdate();
    }
}

export = MusicSkipButton;
