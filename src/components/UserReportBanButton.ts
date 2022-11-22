/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";

class UserReportBanButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.UserReportBanButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.BanMembers ],
            userPermissions: [ PermissionFlagsBits.BanMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const reportedUserId: Snowflake = interaction.message.embeds[0].fields.find(f => f.name === "User ID").value;
        const reportedReason: string = interaction.message.embeds[0].fields.find(f => f.name === "Reason").value;

        await interaction.guild.members.ban(reportedUserId, {
            deleteMessageDays: 7,
            reason: reportedReason,
        });

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    fields: [
                        ...interaction.message.embeds[0].fields,
                        {
                            name: "Action",
                            value: "Banned",
                            inline: true,
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag,
                            inline: true,
                        },
                    ],
                },
            ],
            components: [],
        });
    }
}

export = UserReportBanButton;
