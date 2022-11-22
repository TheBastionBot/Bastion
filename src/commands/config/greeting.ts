/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class GreetingCommand extends Command {
    constructor() {
        super({
            name: "greeting",
            description: "Configure greeting messages in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where the greeting messages will be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The greeting message.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "timeout",
                    description: "The interval after which the greeting message will be deleted.",
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

        // update greeting message
        if (channel || message || timeout) {
            guildDocument.greetingChannel = channel?.id || guildDocument.greetingChannel || interaction.channelId || undefined;
            guildDocument.greetingMessage = message || guildDocument.greetingMessage || undefined;
            guildDocument.greetingMessageTimeout = timeout || guildDocument.greetingMessageTimeout || undefined;

            await guildDocument.save();
            return await interaction.editReply("I've updated the settings for greeting messages.");
        }

        // disable greeting message
        guildDocument.greetingChannel = undefined;
        guildDocument.greetingMessage = undefined;
        guildDocument.greetingMessageTimeout = undefined;

        await guildDocument.save();
        return await interaction.editReply("I've disabled greeting messages.");
    }
}

export = GreetingCommand;
