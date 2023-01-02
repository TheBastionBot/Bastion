/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ComponentType, GuildTextBasedChannel, PermissionFlagsBits, RoleSelectMenuInteraction } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import RoleModel from "../models/Role";
import SelectRoleGroupModel from "../models/SelectRoleGroup";
import * as arrays from "../utils/arrays";
import MessageComponents from "../utils/components";
import { SelectRolesUI } from "../utils/constants";

class SelectRolesUpdateSelectMenu extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.SelectRolesUpdateSelect,
            scope: "guild",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: RoleSelectMenuInteraction<"cached">): Promise<unknown> {
        await interaction.deferUpdate();

        // check whether interaction has the select role group message reference
        if (!interaction.message?.reference?.messageId) return;

        // get the select role group document
        const selectRoleGroup = await SelectRoleGroupModel.findById(interaction.message.reference.messageId);

        // check whether the select role group exists
        if (!selectRoleGroup?.id) {
            return interaction.message.edit({
                content: "The Select Roles group doesn't exist anymore.",
                components: [],
            }).catch(Logger.ignore);
        }

        // fetch the select role group message
        const selectRolesMessage = await (interaction.guild.channels.cache.get(selectRoleGroup.channel) as GuildTextBasedChannel)?.messages.fetch(selectRoleGroup.id).catch(Logger.ignore);

        // check whether the select role group message exists
        if (selectRolesMessage) {
            // update roles in select role group
            selectRoleGroup.roles = interaction.values;
            await selectRoleGroup.save();

            const roleDocuments = await RoleModel.find({
                $or: selectRoleGroup.roles.map(id => ({ id })),
            });

            const selectRoles = selectRoleGroup.roles.map(id => {
                const role = interaction.guild.roles.cache.get(id);
                const roleDocument = roleDocuments.find(r => r.id === id);

                return {
                    value: id,
                    label: role?.name,
                    description: roleDocument?.description,
                    emoji: roleDocument?.emoji || role?.unicodeEmoji,
                };
            });

            // update select role group components with select menu
            if (selectRoleGroup.ui === SelectRolesUI.SelectMenu) {
                return await selectRolesMessage.edit({
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.StringSelect,
                                    customId: MessageComponents.SelectRolesSelect,
                                    placeholder: "Select Roles",
                                    minValues: selectRoleGroup.min || 1,
                                    maxValues: selectRoleGroup.max || selectRoles.length,
                                    options: selectRoles,
                                },
                            ],
                        },
                    ],
                });
            }

            // update select role group components with buttons
            return await selectRolesMessage.edit({
                components: arrays.chunks(selectRoles, 5).map(roles => ({
                    type: ComponentType.ActionRow,
                    components: roles.map(role => ({
                        customId: MessageComponents.SelectRolesButton + ":" + role.value,
                        type: ComponentType.Button,
                        label: role.label,
                        style: ButtonStyle.Secondary,
                        emoji: role.emoji,
                    })),
                })),
            });
        }

        await selectRoleGroup.delete();
    }
}

export = SelectRolesUpdateSelectMenu;
