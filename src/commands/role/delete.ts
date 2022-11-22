/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

class RoleDeleteCommand extends Command {
    constructor() {
        super({
            name: "delete",
            description: "Delete the specified role.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to delete.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for deleting the role.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageRoles ],
            clientPermissions: [ PermissionFlagsBits.ManageRoles ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const role = interaction.options.getRole("role");
        const reason = interaction.options.getString("reason");

        if (role.id === interaction.guildId) {
            return await interaction.reply("You can't delete the **@everyone** role.");
        }

        await role.delete(reason);

        await interaction.reply(`I've deleted the **${ role.name }** role.`);
    }
}

export = RoleDeleteCommand;
