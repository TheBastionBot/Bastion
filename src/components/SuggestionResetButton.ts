/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ButtonStyle, ComponentType, PermissionFlagsBits } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { COLORS } from "../utils/constants.js";

class SuggestionResetButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SuggestionResetButton,
            scope: "guild",
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        // check whether the user has permission to reset suggestion status
        if (!interaction.channel.permissionsFor(interaction.member)?.has(PermissionFlagsBits.ManageMessages)) return interaction.deferUpdate();

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    color: COLORS.INDIGO,
                    fields: [],
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Accept",
                            style: ButtonStyle.Success,
                            customId: MessageComponents.SuggestionAcceptButton,
                        },
                        {
                            type: ComponentType.Button,
                            label: "Reject",
                            style: ButtonStyle.Danger,
                            customId: MessageComponents.SuggestionRejectButton,
                        },
                    ],
                },
            ],
        });
    }
}

export { SuggestionResetButton as MessageComponent };
