/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class LogModCommand extends Command {
    constructor() {
        super({
            name: "mod",
            description: "Configure channel for logging moderation events.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where moderation events will be logged.",
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

        // update moderation log channel
        guildDocument.moderationLogChannel = channel?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ channel?.id ? "enabled" : "disabled" } moderation logs${ channel?.id ? ` in the **${ channel }** channel` : "" }.`);
    }
}

export { LogModCommand as Command };
