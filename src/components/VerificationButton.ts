/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ComponentType, TextInputStyle } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class VerificationButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.VerificationButton,
            scope: "guild",
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        return interaction.showModal({
            custom_id: MessageComponents.VerificationModal,
            title: "Are you a human?",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            custom_id: MessageComponents.VerificationTextInput,
                            type: ComponentType.TextInput,
                            label: "Type \"i am human\" to verify yourself.",
                            placeholder: "i am human",
                            required: true,
                            style: TextInputStyle.Short,
                        },
                    ],
                },
            ],
        });
    }
}

export { VerificationButton as MessageComponent };
