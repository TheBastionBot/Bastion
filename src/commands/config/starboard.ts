/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class StarboardCommand extends Command {
    constructor() {
        super({
            name: "starboard",
            description: "Configure starboard in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: "channel",
                    description: "The channel where starred messages should be sent.",
                    channel_types: [ ChannelType.GuildText ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "threshold",
                    description: "The minimum number of stars a message needs.",
                    min_value: 2,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const channel = interaction.options.getChannel("channel");
        const threshold = interaction.options.getInteger("threshold");

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update starboard channel
        guildDocument.starboardChannel = channel?.id || undefined;
        guildDocument.starboardThreshold = threshold || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ channel?.id ? "enabled" : "disabled" } starboard${ channel?.id ? ` in the **${ channel.name }** channel` : "" }.`);
    }
}

export = StarboardCommand;
