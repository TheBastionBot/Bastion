/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import SelectRoleGroupModel from "../../../models/SelectRoleGroup";

class SelectRolesRemoveCommand extends Command {
    constructor() {
        super({
            name: "remove",
            description: "Remove the specified Select Role Group.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "id",
                    description: "The Select Role Group ID.",
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const id = interaction.options.getString("id");

        // delete the select role group document
        await SelectRoleGroupModel.findByIdAndDelete(id);

        await interaction.editReply(`I've deleted the Select Role Group **${ id }**.`);
    }
}

export = SelectRolesRemoveCommand;
