/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ButtonStyle, ComponentType, PermissionFlagsBits, User } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import GiveawayModel from "../models/Giveaway";
import MessageComponents from "../utils/components";
import { COLORS } from "../utils/constants";

class GiveawayEndButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.GiveawayEndButton,
            scope: "guild",
            userPermissions: [ PermissionFlagsBits.ManageChannels ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        // fetch message
        await interaction.message.fetch().catch(Logger.ignore);

        // find giveaway winners
        const winnerDetails = interaction.message.embeds[0].footer.text.match(/^(\d+) .+/i);
        const winnerCount = parseInt(winnerDetails?.[1]) || 1;
        let winners: User[] = [];

        if (interaction.message.reactions.cache.has("🎉")) {
            // identify giveaway participants
            await interaction.message.reactions.cache.get("🎉").users.fetch().catch(Logger.ignore);

            // get random participants
            winners = interaction.message.reactions.cache.get("🎉").users.cache.filter(u => !u.bot).random(winnerCount);
        }

        await interaction.message.edit({
            embeds: [
                {
                    color: winners.length ? COLORS.SECONDARY : COLORS.RED,
                    author: {
                        name: "GIVEAWAY ENDED",
                    },
                    title: interaction.message.embeds[0].title,
                    description: winners.length ? "The following users have won the giveaway and will be contacted soon for their rewards.\nThank you everyone for participating." : "Unfortunately, no one participated in this giveaway and therfore there aren't any winners this time.",
                    fields: winners.length ? [
                        {
                            name: "Congratulations",
                            value: winners.join(" "),
                        },
                    ] : [],
                    footer: {
                        text: winners.length ? `${ winnerCount } Winners` : "",
                    },
                    timestamp: interaction.createdAt.toISOString(),
                },
            ],
            components: winners.length ? [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            label: "Reroll Giveaway",
                            style: ButtonStyle.Secondary,
                            customId: MessageComponents.GiveawayEndButton,
                        },
                    ],
                },
            ] : [],
        });

        await GiveawayModel.findByIdAndDelete(interaction.message.id).catch(Logger.error);

        await interaction.deferUpdate();
    }
}

export = GiveawayEndButton;
