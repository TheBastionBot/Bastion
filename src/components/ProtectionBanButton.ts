/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { appendModerator } from "../utils/protection/review.js";

class ProtectionBanButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.ProtectionBanButton,
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

        let banned = true;

        await interaction.guild.members.ban(userId, {
            deleteMessageDays: 1,
            reason: "Suspicious Activity detected by Bastion's Protection System",
        }).catch((error: Error) => {
            banned = false;
            Logger.error(error);
        });

        await interaction.update({
            embeds: [
                appendModerator(interaction.message.embeds[0], banned
                    ? `${ interaction.user.tag } — banned the member`
                    : `${ interaction.user.tag } — tried to ban the member, but I may lack permissions or they outrank me`),
            ],
            components: banned ? [] : interaction.message.components,
        });
    }
}

export { ProtectionBanButton as MessageComponent };
