/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class FarewellCommand extends Command {
    constructor() {
        super({
            name: "farewell",
            description: "Configure farewell messages in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where the farewell messages will be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The farewell message.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timeout",
                    description: "The interval after which the farewell message will be deleted.",
                    min_value: 1,
                    max_value: 30,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");
        const message = interaction.options.getString("message");
        const timeout = interaction.options.getInteger("timeout");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update farewell message
        if (channel || message || timeout) {
            guildDocument.farewellChannel = channel?.id || guildDocument.farewellChannel || interaction.channelId || undefined;
            guildDocument.farewellMessage = message || guildDocument.farewellMessage || undefined;
            guildDocument.farewellMessageTimeout = timeout || guildDocument.farewellMessageTimeout || undefined;

            await guildDocument.save();
            return await interaction.editReply("I've updated the settings for farewell messages.");
        }

        // disable farewell message
        guildDocument.farewellChannel = undefined;
        guildDocument.farewellMessage = undefined;
        guildDocument.farewellMessageTimeout = undefined;

        await guildDocument.save();
        return await interaction.editReply("I've disabled farewell messages.");
    }
}

export = FarewellCommand;
