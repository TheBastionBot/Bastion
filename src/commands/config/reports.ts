/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class ReportsCommand extends Command {
    constructor() {
        super({
            name: "reports",
            description: "Configure reports in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where reports should be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update reports channel
        guildDocument.reportsChannel = channel?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ channel?.id ? "enabled" : "disabled" } reports${ channel?.id ? ` in the **${ channel.name }** channel` : "" }.`);
    }
}

export = ReportsCommand;
