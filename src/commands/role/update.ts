/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class RoleUpdateCommand extends Command {
    constructor() {
        super({
            name: "update",
            description: "Update the specified role in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to update.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The new name for the role.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "color",
                    description: "The new color for the role (in HEX code).",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "icon",
                    description: "The new icon for the role (Image URL or Emoji).",
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
                    description: "The reason for updating the role.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageRoles ],
            clientPermissions: [ PermissionFlagsBits.ManageRoles ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");
        const name = interaction.options.getString("name");
        const color = interaction.options.getString("color") as `#${string}`;
        const icon = interaction.options.getString("icon");
        const hoist = interaction.options.getBoolean("hoist");
        const mentionable = interaction.options.getBoolean("mentionable");
        const reason = interaction.options.getString("reason");

        if (role.id === interaction.guildId) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "everyoneRoleEditError"));
        }

        await interaction.guild.roles.edit(role, {
            name: name ?? role.name,
            color: color ?? role.color,
            icon: icon ?? role.icon,
            hoist: typeof hoist === "boolean" ? hoist : role.hoist,
            mentionable: typeof mentionable === "boolean" ? mentionable : role.mentionable,
            reason,
        });

        await interaction.editReply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, "roleUpdateSuccess", { role }),
            allowedMentions: {
                roles: [],
            },
        });
    }
}

export = RoleUpdateCommand;
