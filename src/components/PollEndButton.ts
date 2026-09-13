/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonInteraction, MessageFlags, PermissionFlagsBits } from "discord.js";
import { Client, Logger, MessageComponent } from "@bastion/tesseract";

import MessageComponents from "../utils/components.js";

class PollEndButton extends MessageComponent {
    constructor() {
        super({
            id: MessageComponents.PollEndButton,
            scope: "guild",
            userPermissions: [ PermissionFlagsBits.ManageMessages ],
        });
    }

    /** Removes the end button, acknowledging the click even if it can't be. */
    private async clearButton(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        return await interaction.update({ components: [] }).catch(async (e: Error) => {
            Logger.error(e);
            return await interaction.deferUpdate().catch(Logger.ignore);
        });
    }

    public async exec(interaction: ButtonInteraction<"cached">): Promise<unknown> {
        const text = (key: string): string => (interaction.client as Client).locales.getText(interaction.guildLocale, key);

        // fetch the message if poll data isn't cached
        const message = interaction.message.poll
            ? interaction.message
            : await interaction.message.fetch().catch((e: Error) => {
                Logger.error(e);
                return interaction.message;
            });

        const poll = message.poll;

        // make sure the poll exists
        if (!poll) {
            return await interaction.reply({ content: text("pollNotFound"), flags: MessageFlags.Ephemeral });
        }

        // clear the end button if the poll is already ended
        if (poll.resultsFinalized || (poll.expiresTimestamp !== null && Date.now() > poll.expiresTimestamp)) {
            return await this.clearButton(interaction);
        }

        // end the poll
        const ended = await poll.end().then(() => true).catch((e: Error) => {
            Logger.error(e);
            return false;
        });

        // clear the end button
        if (ended) return await this.clearButton(interaction);

        return await interaction.reply({ content: text("pollEndError"), flags: MessageFlags.Ephemeral });
    }
}

export { PollEndButton as MessageComponent };
