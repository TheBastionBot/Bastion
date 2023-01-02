/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import SelectRoleGroupModel from "../models/SelectRoleGroup";
import MessageComponents from "../utils/components";
import { SelectRolesType } from "../utils/constants";

class SelectRolesButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelectRolesButton,
            scope: "guild",
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        await interaction.deferUpdate();

        // get the selected role id
        const [ , roleId ] = interaction.customId.split(":");

        // get the select role group document
        const selectRoleGroup = await SelectRoleGroupModel.findById(interaction.message?.id);

        // check whether the role exists in the select role group
        if (selectRoleGroup?.roles?.includes(roleId)) {
            // check whether the member already has the role
            if (interaction.member.roles.cache.has(roleId)) {
                // check whether the roles can be removed
                if (selectRoleGroup.type === SelectRolesType.AddOnly) return;

                // remove the role from the member
                return await interaction.member.roles.remove(roleId).catch(Logger.ignore);
            }

            // check whether the roles can be added
            if (selectRoleGroup.type === SelectRolesType.RemoveOnly) return;

            // add the role to the member
            return await interaction.member.roles.add(roleId).catch(Logger.ignore);
        }

    }
}

export = SelectRolesButton;
