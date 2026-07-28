/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, GuildVerificationLevel, PermissionFlagsBits } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class RaidVerificationButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.RaidVerificationButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const current = interaction.guild.verificationLevel;

        if (current === GuildVerificationLevel.VeryHigh) {
            await interaction.reply({
                content: "This server is already at the highest verification level.",
            });

            return;
        }

        const next = current === GuildVerificationLevel.High
            ? GuildVerificationLevel.VeryHigh
            : GuildVerificationLevel.High;

        await interaction.guild.setVerificationLevel(
            next,
            `Raid response by ${ interaction.user.tag }`,
        );

        const level = next === GuildVerificationLevel.VeryHigh ? "Highest" : "High";

        await interaction.reply({
            content: `${ interaction.user } has raised the verification level to **${ level }**.`,
        });
    }
}

export { RaidVerificationButton as MessageComponent };
