/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class LogCommand extends Command {
    constructor() {
        super({
            name: "log",
            description: "Configure channels for moderation and server logs.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "moderation",
                    description: "The channel where moderation logs should be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "server",
                    description: "The channel where server logs should be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const moderation = interaction.options.getChannel("moderation");
        const server = interaction.options.getChannel("server");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update log channels
        guildDocument.moderationLogChannel = moderation?.id || undefined;
        guildDocument.serverLogChannel = server?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ moderation?.id ? "enabled" : "disabled" } moderation logs${ moderation?.id ? ` in the **${ moderation?.name }** channel` : "" } and ${ server?.id ? "enabled" : "disabled" } server logs${ server?.id ? ` in the **${ server?.name }** channel` : "" }.`);
    }
}

export = LogCommand;
