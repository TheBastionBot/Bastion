/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { StringSelectMenuInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import SelectRoleGroupModel from "../models/SelectRoleGroup";
import MessageComponents from "../utils/components";
import { SelectRolesType } from "../utils/constants";

class SelectRolesSelectMenu extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelectRolesSelect,
            scope: "guild",
        });
    }

    public async exec(interaction: StringSelectMenuInteraction<"cached">): Promise<unknown> {
        await interaction.deferUpdate();

        // get the select role group document
        const selectRoleGroup = await SelectRoleGroupModel.findById(interaction.message?.id);

        // get the selected roles
        const roles = interaction.values.filter(id => selectRoleGroup?.roles?.includes(id));

        // check whether the roles exists in the select role group
        if (roles?.length) {
            // check whether the roles can only be removed
            if (selectRoleGroup.type === SelectRolesType.RemoveOnly) {
                // remove the selected roles from the member
                return await interaction.member.roles.remove(roles).catch(Logger.ignore);
            }

            // check whether the roles can only be added
            if (selectRoleGroup.type === SelectRolesType.AddOnly) {
                // add the selected roles to the member
                return await interaction.member.roles.add(roles).catch(Logger.ignore);
            }

            const memberRoles = interaction.member.roles.cache
                .filter(r => !selectRoleGroup.roles.some(id => id === r.id))   // remove all the roles in the select role group
                .map(r => r.id)
                .concat(roles); // add the selected roles

            // update member roles
            await interaction.member.roles.set([ ...new Set(memberRoles) ])
                .catch(Logger.ignore);
        }
    }
}

export = SelectRolesSelectMenu;
