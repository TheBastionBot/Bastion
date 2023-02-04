/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { logModerationEvent } from "../utils/guilds.js";

class UserReportKickButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.UserReportKickButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.KickMembers ],
            userPermissions: [ PermissionFlagsBits.KickMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const reportedUserId: Snowflake = interaction.message.embeds[0].fields.find(f => f.name === "User ID").value;
        const reportedReason: string = interaction.message.embeds[0].fields.find(f => f.name === "Reason").value;

        await interaction.guild.members.kick(reportedUserId, reportedReason);

        const fieldData = [ ...interaction.message.embeds[0].fields ];

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    fields: fieldData.concat([
                        {
                            name: "Action",
                            value: "Kicked",
                            inline: true,
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag,
                            inline: true,
                        },
                    ]),
                },
            ],
            components: [],
        });

        // create moderation log
        logModerationEvent(interaction.guild, {
            title: "User Kicked",
            url: interaction.message.url,
            fields: fieldData.concat([
                {
                    name: "Moderator",
                    value: interaction.user.tag,
                    inline: true,
                },
            ]),
        }).catch(Logger.ignore);
    }
}

export { UserReportKickButton as MessageComponent };
