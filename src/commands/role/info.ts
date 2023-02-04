/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import RoleModel from "../../models/Role.js";
import * as strings from "../../utils/strings.js";
import { COLORS } from "../../utils/constants.js";
import * as snowflake from "../../utils/snowflake.js";

class RoleInfoCommand extends Command {
    constructor() {
        super({
            name: "info",
            description: "Displays information on the specified role.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role whose information you want to display.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");

        // get the role document
        const roleDocument = await RoleModel.findById(role.id);

        await interaction.editReply({
            embeds: [
                {
                    color: role.color || COLORS.PRIMARY,
                    author: {
                        name: role.name,
                    },
                    title: `${ role.managed ? "Managed" : "" } Role`,
                    description: roleDocument?.description,
                    fields: [
                        {
                            name: "Position",
                            value: (interaction.guild.roles.cache.size - role.rawPosition).toString(),
                            inline: true,
                        },
                        {
                            name: "Members",
                            value: `${ role.members.size } Members`,
                            inline: true,
                        },
                        {
                            name: "Created",
                            value: `<t:${ Math.round(role.createdTimestamp / 1000) }>`,
                            inline: true,
                        },
                        {
                            name: "Mentionable",
                            value: role.mentionable ? "Yes" : "No",
                            inline: true,
                        },
                        {
                            name: "Hoisted",
                            value: role.hoist ? "Yes" : "No",
                            inline: true,
                        },
                        {
                            name: "Emoji",
                            value: roleDocument?.emoji ? snowflake.isValid(roleDocument.emoji) ? `<:e:${ roleDocument.emoji }>` : roleDocument.emoji : role.unicodeEmoji || "-",
                            inline: true,
                        },
                        {
                            name: "Permissions",
                            value: role.permissions.bitfield ? role.permissions.toArray().map(p => strings.camelToTitleCase(p)).join(", ") : "-",
                        },
                    ],
                    thumbnail: {
                        url: role.iconURL(),
                    },
                    footer: {
                        text: role.id,
                    },
                },
            ],
        });
    }
}

export { RoleInfoCommand as Command };
