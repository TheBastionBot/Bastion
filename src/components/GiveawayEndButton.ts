/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, ButtonStyle, ComponentType, PermissionFlagsBits, User } from "discord.js";
import { Client, Logger, MessageComponent } from "@bastion/tesseract";

import GiveawayModel from "../models/Giveaway.js";
import MessageComponents from "../utils/components.js";
import { COLORS } from "../utils/constants.js";

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
                    description: (interaction.client as Client).locales.getText(interaction.guildLocale, winners.length ? "giveawayWinners" : "giveawayNoWinners"),
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

export { GiveawayEndButton as MessageComponent };
