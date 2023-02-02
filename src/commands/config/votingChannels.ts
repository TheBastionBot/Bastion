/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import { isPublicBastion } from "../../utils/constants.js";
import { checkFeature, Feature, getPremiumTier } from "../../utils/premium.js";

class VotingChannelsCommand extends Command {
    constructor() {
        super({
            name: "voting-channels",
            description: "Configure voting channels in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "add",
                    description: "The channel you want to add as a voting channel.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "remove",
                    description: "The channel you want to remove as a voting channel.",
                    channel_types: [ ChannelType.GuildText ],
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const addChannel = interaction.options.getChannel("add");
        const removeChannel = interaction.options.getChannel("remove");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // filter deleted channels
        guildDocument.votingChannels = guildDocument.votingChannels?.filter(id => interaction.guild.channels.cache.has(id));

        // add the channel as a voting channel
        if (addChannel) {
            if (guildDocument.votingChannels?.includes(addChannel?.id)) {
                return await interaction.editReply(`${ addChannel } is already a voting channel.`);
            }

            // check for limits
            if (isPublicBastion(interaction.client.user.id)) {
                const tier = await getPremiumTier(interaction.guild.ownerId);
                const limit = checkFeature(tier, Feature.VotingChannels) as number;
                if (guildDocument.votingChannels?.length >= limit) {
                    return interaction.editReply(`You need to upgrade from Bastion ${ tier } to add more than ${ limit } voting channels.`);
                }
            }

            // set rate limit before enabling voting channel
            if ((addChannel as GuildTextBasedChannel).rateLimitPerUser < 5 ) {
                await (addChannel as GuildTextBasedChannel).setRateLimitPerUser(5, "Voting Channel");
            }

            guildDocument.votingChannels = guildDocument.votingChannels?.length ? guildDocument.votingChannels.concat(addChannel.id) : [ addChannel.id ];
            await guildDocument.save();

            return await interaction.editReply(`${ addChannel } has been added as a voting channel.`);
        }

        // remove the channel as a voting channel
        if (removeChannel) {
            if (guildDocument.votingChannels?.includes(removeChannel?.id)) {
                guildDocument.votingChannels = guildDocument.votingChannels?.filter(id => id !== removeChannel.id);
                await guildDocument.save();

                return await interaction.editReply(`${ removeChannel } has been removed as a voting channel.`);
            }

            return await interaction.editReply(`${ removeChannel } is not a voting channel.`);
        }

        if (guildDocument.votingChannels?.length) {
            const channels: GuildTextBasedChannel[] = [];

            for (const channelId of guildDocument.votingChannels) {
                channels.push(interaction.guild.channels.cache.get(channelId) as GuildTextBasedChannel);
            }

            return await interaction.editReply(`The voting channels are ${ channels.join(" ") }`);
        }

        return await interaction.editReply("There are no voting channels in the server.");
    }
}

export { VotingChannelsCommand as Command };
