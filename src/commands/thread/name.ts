/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

class ThreadNameCommand extends Command {
    constructor() {
        super({
            name: "name",
            description: "Change the name of the thread.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The new name for the thread.",
                    required: true,
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply({ ephemeral: true });
        const name = interaction.options.getString("name");

        if (!interaction.channel.isThread()) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "commandThreadOnly"));
        }

        const starterMessage = await interaction.channel.fetchStarterMessage().catch(Logger.error);
        if (!starterMessage) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadFirstMessageError"));
        }

        if (starterMessage.author.id === interaction.user.id) {
            await interaction.channel.setName(name, `Requested by ${ interaction.user.tag }`);
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadName", { name }));
        }

        return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadNoPerms"));
    }
}

export = ThreadNameCommand;
