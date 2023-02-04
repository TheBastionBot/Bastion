/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { StringSelectMenuInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import RoleModel from "../models/Role.js";
import MessageComponents from "../utils/components.js";

class SelfRolesSelectMenu extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelfRolesSelect,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<void> {
        // get all self roles
        const selfRoleDocuments = await RoleModel.find({
            guild: interaction.guildId,
            selfAssignable: true,
        });

        const memberRoles = interaction.member.roles.cache
            .filter(r => !selfRoleDocuments.some(doc => doc.id === r.id))   // remove all the self roles
            .map(r => r.id)
            .concat(interaction.values.filter(id => selfRoleDocuments.some(doc => doc.id === id))); // add the selected self roles

        // update member roles
        await interaction.member.roles.set([ ...new Set(memberRoles) ])
            .catch(Logger.error);

        await interaction.deferUpdate();
    }
}

export { SelfRolesSelectMenu as MessageComponent };
