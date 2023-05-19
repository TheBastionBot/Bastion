/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, escapeMarkdown } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import { isPublicBastion } from "../../utils/constants.js";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium.js";

class LiveStreamsCommand extends Command {
    constructor() {
        super({
            name: "live-streams",
            description: "Follow streamers and get notified in the specified channel when they go live.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "twitch",
                    description: "The twitch channel you want to follow.",
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where the notifications will be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "message",
                    description: "The custom message for notification.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const twitchChannel = interaction.options.getString("twitch")?.toLowerCase();
        const channel = interaction.options.getChannel("channel");
        const message = interaction.options.getString("message");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (twitchChannel || channel || message) {
            // update followed channels
            if (twitchChannel) {
                guildDocument.twitchNotificationUsers = guildDocument.twitchNotificationUsers?.includes(twitchChannel) ? guildDocument.twitchNotificationUsers.filter(u => u !== twitchChannel) : guildDocument.twitchNotificationUsers?.concat(twitchChannel);

                // check for limits
                if (isPublicBastion(interaction.client.user.id)) {
                    const tier = await getPremiumTier(interaction.guild.ownerId);
                    const limit = checkFeature(tier, Feature.StreamersPerService) as number;
                    if (guildDocument.twitchNotificationUsers?.length > limit) {
                        return interaction.editReply(`You need to upgrade from Bastion ${ tier } to get live notifications for more than ${ limit } channels.`);
                    }
                }
            }

            // update notification channel
            if (channel) {
                guildDocument.twitchNotificationChannel = channel?.id;
            }

            // update notification message
            if (message) {
                guildDocument.twitchNotificationMessage = message;
            }

            await guildDocument.save();
            return await interaction.editReply("I've updated Twitch live notification settings.");
        }

        return await interaction.editReply(guildDocument.twitchNotificationUsers?.length ? `You'll be notified when these Twitch channels go live: **${ escapeMarkdown(guildDocument.twitchNotificationUsers.join(", ")) }**.` : "You're not following any channels for live notifications.");
    }
}

export { LiveStreamsCommand as Command };
