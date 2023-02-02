/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ClearCommand extends Command {
    constructor() {
        super({
            name: "clear",
            description: "Clear recent messages (newer than two weeks) in the channel.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "limit",
                    description: "Limit the numbers of messages that should be deleted.",
                    min_value: 1,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "bots",
                    description: "Should it delete messages from bots.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "pinned",
                    description: "Should it delete messages that are pinned.",
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "system",
                    description: "Should it delete system messages.",
                },
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "Only delete messages from this user.",
                },
            ],
            clientPermissions: [ PermissionFlagsBits.ManageMessages ],
            userPermissions: [ PermissionFlagsBits.ManageMessages ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const limit = interaction.options.getInteger("limit") || 100;
        const bots = interaction.options.getBoolean("bots");
        const pinned = interaction.options.getBoolean("pinned");
        const system = interaction.options.getBoolean("system");
        const user = interaction.options.getUser("user");

        // fetch deletable messages
        let messages = await interaction.channel.messages.fetch({ limit, before: interaction.id });

        // filter messages from the specified user
        if (user) messages = messages.filter(m => m.author.id === user.id);

        // filter messages from bots
        if (bots) messages = messages.filter(m => m.author.bot);
        else if (bots === false) messages = messages.filter(m => !m.author.bot);

        // filter pinned messages
        if (pinned) messages = messages.filter(m => m.pinned);
        else if (pinned === false) messages = messages.filter(m => !m.pinned);

        // filter system messages
        if (system) messages = messages.filter(m => m.system);
        else if (system === false) messages = messages.filter(m => !m.system);

        // bulk delete messages
        const deletedMessages = await interaction.channel.bulkDelete(messages, true);

        await interaction.editReply(
            deletedMessages?.size
                ?   (interaction.client as Client).locales.getText(interaction.guildLocale, "messageBulkDeleted", { count: deletedMessages.size })
                :   (interaction.client as Client).locales.getText(interaction.guildLocale, "messageBulkDeleteNotFound")
        );
    }
}

export { ClearCommand as Command };
