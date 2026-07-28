/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, GuildFeature, PermissionFlagsBits } from "discord.js";
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

        await interaction.guild.disableInvites(!paused);

        await interaction.reply({
            content: `${ interaction.user } has ${ paused ? "resumed" : "paused" } invites in the server.`,
        });
    }
}

export { RaidPauseInvitesButton as MessageComponent };
