/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { APIActionRowComponent, APIButtonComponent, ButtonInteraction, GuildFeature, PermissionFlagsBits } from "discord.js";
import { MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class RaidPauseInvitesButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.RaidPauseInvitesButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ManageGuild ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        const paused = interaction.guild.features.includes(GuildFeature.InvitesDisabled);

        try {
            await interaction.guild.disableInvites(!paused);
        } catch {
            await interaction.reply({
                content: `I couldn't ${ paused ? "resume" : "pause" } invites. I need the **Manage Server** permission.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.update({
            components: interaction.message.components.map(row => {
                const json = row.toJSON() as APIActionRowComponent<APIButtonComponent>;

                return {
                    ...json,
                    components: json.components.map(button => "custom_id" in button && button.custom_id === MessageComponents.RaidPauseInvitesButton
                        ? { ...button, label: paused ? "Pause Invites" : "Resume Invites" }
                        : button),
                };
            }),
        });
    }
}

export { RaidPauseInvitesButton as MessageComponent };
