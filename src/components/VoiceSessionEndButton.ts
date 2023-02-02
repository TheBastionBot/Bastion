/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, PermissionFlagsBits } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class VoiceSessionEndButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.VoiceSessionEndButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
            userPermissions: [ PermissionFlagsBits.MoveMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        if (interaction.memberPermissions.has(PermissionFlagsBits.MoveMembers)) {
            await interaction.channel.delete("Voice session manually ended.").catch(Logger.ignore);
        }

        await interaction.deferUpdate();
    }
}

export { VoiceSessionEndButton as MessageComponent };
