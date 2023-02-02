/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, ChannelType, GuildChannelTypes, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ChannelCreateCommand extends Command {
    constructor() {
        super({
            name: "create",
            description: "Create a new channel in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The name of the new channel.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "type",
                    description: "The type of the new channel.",
                    choices: [
                        { name: "Text", value: ChannelType.GuildText },
                        { name: "Voice", value: ChannelType.GuildVoice },
                        { name: "Announcement", value: ChannelType.GuildAnnouncement },
                        { name: "Stage", value: ChannelType.GuildStageVoice },
                        { name: "Category", value: ChannelType.GuildCategory },
                    ],
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "topic",
                    description: "The topic for the new channel.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "limit",
                    description: "Limit the number of users for the new (voice) channel.",
                    min_value: 1,
                    max_value: 99,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "slowmode",
                    description: "Enable slowmode with the specified interval (in seconds).",
                    min_value: 0,
                    max_value: 21600,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "nsfw",
                    description: "Should the channel be NSFW.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for creating the channel.",
                },
            ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
            userPermissions: [ PermissionFlagsBits.ManageChannels ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const name = interaction.options.getString("name");
        const type = interaction.options.getInteger("type") as GuildChannelTypes;
        const topic = interaction.options.getString("topic");
        const limit = interaction.options.getInteger("limit");
        const slowmode = interaction.options.getInteger("slowmode");
        const isNSFW = interaction.options.getBoolean("nsfw");
        const reason = interaction.options.getString("reason");

        const channel = await interaction.guild.channels.create({
            name,
            type,
            topic,
            nsfw: isNSFW,
            bitrate: interaction.guild.premiumTier ? interaction.guild.premiumTier * 128e3 : 96e3,
            userLimit: limit,
            rateLimitPerUser: slowmode,
            parent: type === ChannelType.GuildCategory ? undefined :interaction.channel.parentId,
            reason,
        });

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "channelCreated", { channel }));
    }
}

export { ChannelCreateCommand as Command };
