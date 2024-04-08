/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import SelectRoleGroupModel from "../../../models/SelectRoleGroup.js";

class SelectRolesRemoveCommand extends Command {
    constructor() {
        super({
            name: "remove",
            description: "Remove the specified Select Roles Group.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "id",
                    description: "The Select Roles Group ID.",
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const id = interaction.options.getString("id");

        // delete the select roles group document
        const selectRoleGroup = await SelectRoleGroupModel.findByIdAndDelete(id);

        // delete the select roles group message
        const channel = interaction.guild.channels.cache.get(selectRoleGroup?.channel);
        if (channel?.isTextBased()) {
            await channel.messages.delete(selectRoleGroup.id).catch(Logger.ignore);
        }

        await interaction.editReply(`I've deleted the Select Roles Group **${ id }**.`);
    }
}

export { SelectRolesRemoveCommand as Command };
