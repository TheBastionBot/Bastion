/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

class ThreadCloseCommand extends Command {
    constructor() {
        super({
            name: "close",
            description: "Close and lock the thread.",
            options: [],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.channel.isThread()) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "commandThreadOnly"));
        }

        const starterMessage = await interaction.channel.fetchStarterMessage().catch(Logger.error);
        if (!starterMessage) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadFirstMessageError"));
        }

        if (starterMessage.author.id === interaction.user.id) {
            await interaction.channel.edit({
                archived: true,
                locked: true,
                reason: `Requested by ${ interaction.user.tag }`,
            });
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadArchive"));
        }

        return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadNoPerms"));
    }
}

export { ThreadCloseCommand as Command };
