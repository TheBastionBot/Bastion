/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import RoleModel from "../models/Role.js";
import MessageComponents from "../utils/components.js";

class SelfRolesClearButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelfRolesClearButton,
            scope: "guild",
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        // get all self roles
        const selfRoleDocuments = await RoleModel.find({
            guild: interaction.guildId,
            selfAssignable: true,
        });

        const memberRoles = interaction.member.roles.cache
            .filter(r => !selfRoleDocuments.some(doc => doc.id === r.id));  // remove all the self roles

        // update member roles
        await interaction.member.roles.set(memberRoles)
            .catch(Logger.error);

        await interaction.deferUpdate();
    }
}

export { SelfRolesClearButton as MessageComponent };
