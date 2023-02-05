/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ModalSubmitInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import MessageComponents from "../utils/components.js";

class VerificationModal extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.VerificationModal,
            scope: "guild",
        });
    }

    public async exec(interaction: ModalSubmitInteraction<"cached">): Promise<void> {
        const inputValue = interaction.fields.getTextInputValue(MessageComponents.VerificationTextInput)?.toLowerCase();

        if ([ "i'm human", "i am human" ].includes(inputValue)) {
            await interaction.deferUpdate();

            const guildDocument = await GuildModel.findById(interaction.guildId);

            if (guildDocument.verifiedRole) {
                await interaction.member.roles.add(guildDocument.verifiedRole, "Verified").catch(Logger.ignore);
            }
        }
    }
}

export { VerificationModal as MessageComponent };
