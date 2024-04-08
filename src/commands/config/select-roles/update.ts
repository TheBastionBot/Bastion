/*!
 * @author TRACTION (iamtraction)
 * @copyright 2024
 */
import { ApplicationCommandOptionType, ButtonStyle, ChatInputCommandInteraction, ComponentType, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import RoleModel from "../../../models/Role.js";
import SelectRoleGroupModel from "../../../models/SelectRoleGroup.js";
import * as arrays from "../../../utils/arrays.js";
import MessageComponents from "../../../utils/components.js";
import { SelectRolesUI } from "../../../utils/constants.js";
import { generate as generateEmbed } from "../../../utils/embeds.js";

class SelectRolesUpdateCommand extends Command {
    constructor() {
        super({
            name: "update",
            description: "Update the roles and message for the Select Roles Group.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "id",
                    description: "The Select Roles Group ID.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The new message content.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const id = interaction.options.getString("id");
        const message = generateEmbed(interaction.options.getString("message") || "");

        // get the select roles group document
        const selectRoleGroup = await SelectRoleGroupModel.findById(id);

        // check whether the select roles group exists
        if (!selectRoleGroup?.id) {
            return interaction.editReply(`The Select Roles Group **${ id }** doesn't exist.`);
        }

        // fetch the select roles group message
        const selectRolesMessage = await (interaction.guild.channels.cache.get(selectRoleGroup.channel) as GuildTextBasedChannel)?.messages.fetch(selectRoleGroup.id).catch(Logger.ignore);

        // check whether the select roles group message exists
        if (selectRolesMessage) {
            // update roles in select roles group
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

            // update select roles group components with select menu
            if (selectRoleGroup.ui === SelectRolesUI.SelectMenu) {
                await selectRolesMessage.edit({
                    content: message ? typeof message === "string" ? message : "" : undefined,
                    embeds: message ? typeof message === "string" ? [] : [ message ] : undefined,
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.StringSelect,
                                    customId: MessageComponents.SelectRolesSelect,
                                    placeholder: "Select Roles",
                                    minValues: selectRoleGroup.min || 0,
                                    maxValues: selectRoleGroup.max || selectRoles.length,
                                    options: selectRoles,
                                },
                            ],
                        },
                    ],
                });
            } else {
                // update select roles group components with buttons
                await selectRolesMessage.edit({
                    content: message ? typeof message === "string" ? message : "" : undefined,
                    embeds: message ? typeof message === "string" ? [] : [ message ] : undefined,
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

            return interaction.editReply(`I've updated the Select Roles Group **${ id }**.`);
        }

        await interaction.editReply(`The Select Roles Group **${ id }** doesn't exist anymore.`);
    }
}

export { SelectRolesUpdateCommand as Command };
