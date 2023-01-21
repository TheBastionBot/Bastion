/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ChannelDeleteCommand extends Command {
    constructor() {
        super({
            name: "delete",
            description: "Delete the current (or the specified) channel.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel you want to delete.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for deleting the channel.",
                },
            ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
            userPermissions: [ PermissionFlagsBits.ManageChannels ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");
        const reason = interaction.options.getString("reason");

        await (channel || interaction.channel).delete(reason);

        if (channel?.id && channel.id !== interaction.channelId) {
            await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "channelDeleted", { channel: channel.name }));
        }
    }
}

export = ChannelDeleteCommand;
