/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, VoiceChannel, PermissionFlagsBits } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";

class VoiceSessionUnlockButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.VoiceSessionUnlockButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
            userPermissions: [ PermissionFlagsBits.MoveMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        if (interaction.memberPermissions.has(PermissionFlagsBits.MoveMembers)) {
            (interaction.channel as VoiceChannel).permissionOverwrites.edit(interaction.guildId, {
                Connect: true,
                ViewChannel: true,
            }, { reason: "Unlock Voice Session" }).catch(Logger.ignore);
        }

        await interaction.deferUpdate();
    }
}

export = VoiceSessionUnlockButton;
