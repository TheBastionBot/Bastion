/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ButtonStyle, ComponentType, PermissionFlagsBits } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";
import { COLORS } from "../utils/constants";

class SuggestionAcceptButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SuggestionAcceptButton,
            scope: "guild",
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        // check whether the user has permission to accept suggestions
        if (!interaction.channel.permissionsFor(interaction.member)?.has(PermissionFlagsBits.ManageMessages)) return interaction.deferUpdate();

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    color: COLORS.GREEN,
                    fields: [
                        {
                            name: "Status",
                            value: "Accepted",
                            inline: true,
                        },
                        {
                            name: "Accepted By",
                            value: interaction.user.tag,
                            inline: true,
                        },
                    ],
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Change Status",
                            style: ButtonStyle.Secondary,
                            customId: MessageComponents.SuggestionRejectButton,
                        },
                    ],
                },
            ],
        });
    }
}

export = SuggestionAcceptButton;
