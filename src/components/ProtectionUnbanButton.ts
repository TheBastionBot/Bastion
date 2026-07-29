/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { appendModerator } from "../utils/protection/review.js";

class ProtectionUnbanButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.ProtectionUnbanButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.BanMembers ],
            userPermissions: [ PermissionFlagsBits.BanMembers ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const userId: Snowflake = interaction.message.embeds[0].fields.find(field => field.name === "User ID")?.value;

        if (!userId) {
            await interaction.reply({
                content: "I can't act on this — the incident record can no longer be read.",
                ephemeral: true,
            });
            return;
        }

        let unbanned = true;

        await interaction.guild.members.unban(userId, "Suspicious Activity review overturned by a moderator")
            .catch((error: Error) => {
                unbanned = false;
                Logger.error(error);
            });

        await interaction.update({
            embeds: [
                appendModerator(interaction.message.embeds[0], unbanned
                    ? `${ interaction.user.tag } — unbanned the member`
                    : `${ interaction.user.tag } — tried to unban the member, but I may lack permissions`),
            ],
            components: unbanned ? [] : interaction.message.components,
        });
    }
}

export { ProtectionUnbanButton as MessageComponent };
