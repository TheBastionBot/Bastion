/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonInteraction, PermissionFlagsBits } from "discord.js";
import { Logger, MessageComponent } from "@bastion/tesseract";

import PollModel from "../models/Poll.js";
import MessageComponents from "../utils/components.js";
import { COLORS } from "../utils/constants.js";

class PollEndButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.PollEndButton,
            scope: "guild",
            userPermissions: [ PermissionFlagsBits.ManageMessages ],
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<void> {
        // fetch message
        await interaction.message.fetch().catch(Logger.ignore);

        // identify poll options
        const options = interaction.message.embeds[0].fields.map(f => f.value);

        // identify poll votes
        const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];
        const votes: { [key: string]: number } = {};

        let totalVotes = 0;
        for (const key in reactions.slice(0, options.length)) {
            if (interaction.message.reactions.cache.has(reactions[key])) {
                // calculate votes
                const votesCount = interaction.message.reactions.cache.get(reactions[key]).count;
                votes[reactions[key]] = votesCount;
                totalVotes += votesCount;
            }
        }

        await interaction.message.edit({
            embeds: [
                {
                    color: COLORS.SECONDARY,
                    author: {
                        name: "POLL ENDED",
                    },
                    title: interaction.message.embeds[0].title,
                    fields: interaction.message.embeds[0].fields.sort((a, b) => (votes[b.name] || 0) - (votes[a.name] || 0) ).map(f => ({
                        name: f.value,
                        value: `${ votes[f.name] || 0 } votes — ${ ((votes[f.name] || 0) / totalVotes * 100).toFixed(0) }%`,
                    })),
                    footer: {
                        text: `${ totalVotes } votes`
                    },
                    timestamp: interaction.createdAt.toISOString(),
                },
            ],
            components: [],
        });

        await interaction.message.reactions.removeAll().catch(Logger.ignore);

        await PollModel.findByIdAndDelete(interaction.message.id).catch(Logger.error);

        await interaction.deferUpdate();
    }
}

export { PollEndButton as MessageComponent };
