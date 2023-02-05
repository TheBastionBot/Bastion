/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ComponentType, PermissionFlagsBits } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class SelectRolesNoRolesButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelectRolesNoRolesButton,
            scope: "guild",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        await interaction.reply({
            content: "Select the roles you want to have in this Select Role Group.",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.RoleSelect,
                            customId: MessageComponents.SelectRolesUpdateSelect,
                            placeholder: "Select Roles",
                            minValues: 1,
                            maxValues: 25,
                        },
                    ],
                },
            ],
            ephemeral: true,
        });
    }
}

export { SelectRolesNoRolesButton as MessageComponent };
