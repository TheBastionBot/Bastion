/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildTextBasedChannel, PermissionFlagsBits, ThreadChannel, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

class ChannelUpdateCommand extends Command {
    constructor() {
        super({
            name: "update",
            description: "Update the specified channel in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel you want to update.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "The new name for the channel.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "topic",
                    description: "The new topic for the channel.",
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "limit",
                    description: "The new limit of users for the (voice) channel.",
                    min_value: 1,
                    max_value: 99,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "slowmode",
                    description: "The new slowmode interval (in seconds).",
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
                    description: "The reason for updating the channel.",
                },
            ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
            userPermissions: [ PermissionFlagsBits.ManageChannels ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        const name = interaction.options.getString("name");
        const topic = interaction.options.getString("topic");
        const limit = interaction.options.getInteger("limit");
        const slowmode = interaction.options.getInteger("slowmode");
        const isNSFW = interaction.options.getBoolean("nsfw");
        const reason = interaction.options.getString("reason");

        await interaction.guild.channels.edit(channel, {
            name: name ?? channel.name,
            topic: topic ?? (channel as Exclude<GuildTextBasedChannel, ThreadChannel | VoiceChannel>).topic,
            nsfw: typeof isNSFW === "boolean" ? isNSFW : (channel as Exclude<GuildTextBasedChannel, ThreadChannel>).nsfw,
            userLimit: limit ?? (channel as VoiceBasedChannel).userLimit,
            rateLimitPerUser: slowmode ?? (channel as GuildTextBasedChannel).rateLimitPerUser,
            reason,
        });

        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "channelUpdated", { channel: channel }));
    }
}

export { ChannelUpdateCommand as Command };
