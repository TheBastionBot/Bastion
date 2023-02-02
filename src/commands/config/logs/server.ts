/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class LogServerCommand extends Command {
    constructor() {
        super({
            name: "server",
            description: "Configure channel for logging server events.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where server logs should be sent.",
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

        // update server log channel
        guildDocument.serverLogChannel = channel?.id || undefined;
        // disable message content logs if server logs is disabled
        guildDocument.serverLogContent = channel?.id ? guildDocument.serverLogContent : undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ channel?.id ? "enabled" : "disabled" } server logs${ channel?.id ? ` in the **${ channel }** channel` : "" }.`);
    }
}

export { LogServerCommand as Command };
