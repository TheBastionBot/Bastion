/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, PermissionFlagsBits, Snowflake } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";
import { IGNORE_TTL, ignoreMember } from "../utils/protection/index.js";
import { resolveMember } from "../utils/members.js";

class ProtectionIgnoreButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.ProtectionIgnoreButton,
            scope: "guild",
            clientPermissions: [ PermissionFlagsBits.ModerateMembers ],
            userPermissions: [ PermissionFlagsBits.ModerateMembers ],
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

        const member = await resolveMember(interaction.guild, userId);

        // remove the timeout and stop the same burst re-triggering
        if (member?.moderatable) {
            await member.timeout(null, `Ignored by ${ interaction.user.tag }`).catch(Logger.error);
        }

        ignoreMember(interaction.guildId, userId);

        const fields = [ ...interaction.message.embeds[0].fields ];

        await interaction.update({
            embeds: [
                {
                    ...interaction.message.embeds[0].toJSON(),
                    fields: fields.concat([
                        {
                            name: "Moderator",
                            value: `${ interaction.user.tag } — ignored the member, not flagged again until <t:${ Math.floor((Date.now() + IGNORE_TTL * 6e4) / 1000) }:t>`,
                        },
                    ]),
                },
            ],
            components: [],
        });
    }
}

export { ProtectionIgnoreButton as MessageComponent };
