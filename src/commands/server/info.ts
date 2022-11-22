/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChannelType, ChatInputCommandInteraction, time } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import { COLORS, isPublicBastion } from "../../utils/constants";
import { getPremiumTier } from "../../utils/premium";

class ChannelInfoCommand extends Command {
    constructor() {
        super({
            name: "info",
            description: "Displays information on the server.",
            scope: "guild",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();

        // check for premium membership
        const tier = isPublicBastion(interaction.client.user.id) && await getPremiumTier(interaction.guild.ownerId).catch(Logger.ignore);

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: interaction.guild.name,
                        // TODO: server page - url: ,
                    },
                    title: (interaction.guild.partnered ? "Partnered" : interaction.guild.verified ? "Verified" : "") + " Server",
                    // TODO: badges - description: ,
                    fields: [
                        {
                            name: "About",
                            value: interaction.guild.description || "-",
                        },
                        {
                            name: "Owner",
                            value: interaction.guild.members.cache.get(interaction.guild.ownerId)?.user?.tag || interaction.guild.ownerId,
                        },
                        {
                            name: "Level",
                            value: `Level ${ interaction.guild.premiumTier } • ${ interaction.guild.premiumSubscriptionCount } Boosts`,
                            inline: true,
                        },
                        {
                            name: "Created",
                            value: time(interaction.guild.createdAt),
                            inline: true,
                        },
                        {
                            name: "Members",
                            value: `${ interaction.guild.approximateMemberCount || interaction.guild.memberCount } / ${ interaction.guild.maximumMembers } Members`,
                        },
                        {
                            name: "Roles",
                            value: `${ interaction.guild.roles.cache.size } Roles`,
                            inline: true,
                        },
                        {
                            name: "Channels",
                            value: `${ interaction.guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory).size } Channels`,
                            inline: true,
                        },
                        {
                            name: "Emojis",
                            value: `${ interaction.guild.emojis.cache.size } Emojis`,
                            inline: true,
                        },
                    ],
                    thumbnail: {
                        url: interaction.guild.iconURL(),
                    },
                    image: {
                        url: interaction.guild.bannerURL() || interaction.guild.splashURL() || interaction.guild.discoverySplashURL(),
                    },
                    footer: {
                        text: `Powered by Bastion${ tier ? ` ${ tier }` : "" } • ${ interaction.guildId }`,
                    },
                },
            ],
        });
    }
}

export = ChannelInfoCommand;
