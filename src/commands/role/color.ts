/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, HexColorString } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import Color from "color";
import { randomBytes } from "crypto";

class RoleColorCommand extends Command {
    constructor() {
        super({
            name: "color",
            description: "Set the color of the specified role.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "color",
                    description: "The color of the role. A color is chosen randomly, if not specified.",
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role which you want the color changed. A role is created, if not specified.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const colorInput = interaction.options.getString("color");
        let color: HexColorString;
        
        if (colorInput) {
            try {
                color = (new Color(colorInput)).hex().toLowerCase() as HexColorString;
            } catch {
                return interaction.editReply("Invalid color.");
            }
        }
        
        color = color || `#${randomBytes(3).toString("hex")}`;
        
        let role = interaction.options.getRole("role");
        if (!role) {
            const userRoleName = `User-${interaction.user.id}`;
            role = interaction.guild.roles.cache.find(r => r.name === userRoleName);
            if (!role) {
                await interaction.guild.roles.create({
                    name: userRoleName,
                    color,
                    hoist: false,
                }).then(newRole => { role = newRole; })
                    .catch(Logger.ignore);

                if (!role) {
                    return interaction.editReply("Failed to create role.");
                }

                try {
                    await interaction.member.roles.add(role);
                } catch {
                    role.delete().catch(Logger.ignore);
                    return interaction.editReply("Failed to assign a new role to you.");
                }

                role.edit({ position: interaction.member.roles.cache.first().position, }).catch(Logger.ignore);
            }
        }

        if (!role.editable) {
            return interaction.editReply("This role is not editable.").catch(Logger.ignore);
        }

        await role.edit({ color });

        return interaction.editReply(`Successfully changed the color of **${role.name}** to **${color}**.`);
    }
}

export = RoleColorCommand;
