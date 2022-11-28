/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import RoleModel from "../models/Role";
import MessageComponents from "../utils/components";

class IamCommand extends Command {
    constructor() {
        super({
            name: "iam",
            description: "Assign a self assignable role to yourself.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role you want to assign yourself.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });
        const role = interaction.options.getRole("role");

        if (role) {
            if (role.id === interaction.guildId) {
                return await interaction.editReply({
                    content: (interaction.client as Client).locales.getText(interaction.guildLocale, "selfRoleInvalid", { role: "@everyone" }),
                    allowedMentions: {
                        roles: [],
                    },
                });
            }

            // check if role is self assignable
            const roleDocument = await RoleModel.findById(role.id);

            if (roleDocument?.selfAssignable) {
                // update role
                if (interaction.member.roles.cache.has(role.id)) {
                    await interaction.member.roles.remove(role);
                } else {
                    await interaction.member.roles.add(role);
                }

                return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, interaction.member.roles.cache.has(role.id) ? "selfRoleUnassign" : "selfRoleAssign", { role: role }));
            }

            return await interaction.editReply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "selfRoleInvalid", { role: role }),
                allowedMentions: {
                    roles: [],
                },
            });
        }

        const selfRoleDocuments = await RoleModel.find({
            guild: interaction.guildId,
            selfAssignable: true,
        });

        const selfRoles = interaction.guild.roles.cache.filter(r => selfRoleDocuments.some(doc => doc.id === r.id));

        if (!selfRoles?.size) return interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "selfRolesEmpty"));

        await interaction.editReply({
            content: (interaction.client as Client).locales.getText(interaction.guildLocale, "selfRolesSelect"),
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.StringSelect,
                            customId: MessageComponents.SelfRolesSelect,
                            placeholder: "Select Roles",
                            minValues: 0,
                            maxValues: selfRoles.size,
                            options: selfRoles.map(r => ({
                                value: r.id,
                                label: r.name,
                            })),
                        },
                    ],
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Clear",
                            style: ButtonStyle.Secondary,
                            customId: MessageComponents.SelfRolesClearButton,
                        },
                    ],
                },
            ],
        });
    }
}

export = IamCommand;
