/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildChannel, GuildTextBasedChannel, TextChannel, ThreadChannel } from "discord.js";
import { Command } from "@bastion/tesseract";

import { COLORS } from "../../utils/constants";
import { resolveType } from "../../utils/channels";

class ChannelInfoCommand extends Command {
    constructor() {
        super({
            name: "info",
            description: "Displays information on the current (or specified) channel.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel whose information you want to display.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.PRIMARY,
                    author: {
                        name: channel.name,
                    },
                    title: `${ resolveType(channel.type) } Channel`,
                    description: (channel as TextChannel)?.topic,
                    fields: [
                        {
                            name: "Category",
                            value: channel.parent?.name ?? "-",
                            inline: true,
                        },
                        {
                            name: "Members",
                            value: ((channel as Exclude<GuildChannel, ThreadChannel>).members.size || (channel as ThreadChannel).members.cache?.size) + " Members",
                            inline: true,
                        },
                        {
                            name: "Created",
                            value: `<t:${ Math.round(channel.createdTimestamp / 1000) }>`,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: ((channel as Exclude<GuildTextBasedChannel, ThreadChannel>).permissionsLocked ? "Synced" : "Not Synced") + " • " + channel.id,
                    },
                },
            ],
        });
    }
}

export = ChannelInfoCommand;
