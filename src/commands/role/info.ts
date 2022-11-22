/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

import * as strings from "../../utils/strings";
import { COLORS } from "../../utils/constants";

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
        const role = interaction.options.getRole("role");

        await interaction.reply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: role.name,
                    },
                    title: `${ role.managed ? "Managed" : "" } Role`,
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
                            name: "Permissions",
                            value: role.permissions.bitfield ? role.permissions.toArray().map(p => strings.camelToTitleCase(p)).join(", ") : "-",
                        },
                    ],
                    footer: {
                        text: `${ role.hoist ? "Hoisted •" : "" } ${ role.id }`,
                    },
                },
            ],
        });
    }
}

export = RoleInfoCommand;
