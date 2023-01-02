/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components";
import { logModerationEvent } from "../utils/guilds";

class UserReportTimeoutButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.UserReportTimeoutButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ModerateMembers ],
            userPermissions: [ PermissionFlagsBits.ModerateMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const reportedUserId: Snowflake = interaction.message.embeds[0].fields.find(f => f.name === "User ID").value;
        const reportedReason: string = interaction.message.embeds[0].fields.find(f => f.name === "Reason").value;

        await interaction.guild.members.cache.get(reportedUserId)?.timeout(36e5, reportedReason);

        const fieldData = [ ...interaction.message.embeds[0].fields ];

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    fields: fieldData.concat([
                        {
                            name: "Action",
                            value: "Timed out",
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
            title: "User Timed Out",
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

export = UserReportTimeoutButton;
