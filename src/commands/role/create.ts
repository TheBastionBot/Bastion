/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

class RoleCreateCommand extends Command {
    constructor() {
        super({
            name: "create",
            description: "Create a new role in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the new role.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "color",
                    description: "The color for the new role (in HEX code).",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "icon",
                    description: "The icon for the new role (Image URL or Emoji).",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "hoist",
                    description: "Should the members be displayed separately from others.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "mentionable",
                    description: "Should the role be mentionable.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for creating the role.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageRoles ],
            clientPermissions: [ PermissionFlagsBits.ManageRoles ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");
        const color = interaction.options.getString("color") as `#${string}`;
        const icon = interaction.options.getString("icon");
        const hoist = interaction.options.getBoolean("hoist");
        const mentionable = interaction.options.getBoolean("mentionable");
        const reason = interaction.options.getString("reason");

        const role = await interaction.guild.roles.create({
            name,
            color,
            hoist,
            icon,
            mentionable,
            reason,
        });

        await interaction.editReply({
            content: `I've created the ${ role } role.`,
            allowedMentions: {
                roles: [],
            },
        });
    }
}

export = RoleCreateCommand;
