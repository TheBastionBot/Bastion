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
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "log-content",
                    description: "Whether content of deleted or edited messages should be logged.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const moderation = interaction.options.getChannel("moderation");
        const server = interaction.options.getChannel("server");
        const logContent = interaction.options.getBoolean("log-content");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (logContent && !moderation && !server) {
            guildDocument.logContent = logContent;
            await guildDocument.save();
            return await interaction.editReply(`I've ${ logContent ? "enabled" : "disabled" } content logs for deleted or edited messages.`);
        }

        // update log channels
        guildDocument.moderationLogChannel = moderation?.id || undefined;
        guildDocument.serverLogChannel = server?.id || undefined;
        guildDocument.logContent = logContent ?? guildDocument.logContent;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ moderation?.id ? "enabled" : "disabled" } moderation logs${ moderation?.id ? ` in the **${ moderation?.name }** channel` : "" }, ${ server?.id ? "enabled" : "disabled" } server logs${ server?.id ? ` in the **${ server?.name }** channel` : "" }, and ${ logContent ? "enabled" : "disabled" } content logs for deleted or edited messages.`);
    }
}

export = LogCommand;
