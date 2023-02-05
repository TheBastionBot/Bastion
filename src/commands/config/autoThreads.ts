/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";

class AutoThreadsCommand extends Command {
    constructor() {
        super({
            name: "auto-threads",
            description: "Configure auto threads in the server.",
            options: [],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // check whether the channel is valid
        if (interaction.channel.type !== ChannelType.GuildText) {
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadsInvalidChannel"));
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // disable auto threads
        if (guildDocument.autoThreadChannels?.includes(interaction.channelId)) {
            guildDocument.autoThreadChannels = [];

            await guildDocument.save();
            return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadsDisable"));
        }

        // set rate limit before enabling auto threads
        if (interaction.channel.rateLimitPerUser < 5 ) {
            await interaction.channel.setRateLimitPerUser(5, "Auto Threads Channel");
        }

        // enable auto threads
        guildDocument.autoThreadChannels = [ interaction.channelId ];

        await guildDocument.save();
        return await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "autoThreadsEnable", { channel: interaction.channel }));
    }
}

export { AutoThreadsCommand as Command };
