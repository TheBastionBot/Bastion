/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild.js";

class HoneypotRemoveCommand extends Command {
    constructor() {
        super({
            name: "remove",
            description: "Remove the honeypot channel from the server.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
            clientPermissions: [ PermissionFlagsBits.ManageChannels ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (!guildDocument?.honeypotChannel) {
            return await interaction.editReply("No honeypot channel is set up in the server.");
        }

        const channel = interaction.guild.channels.cache.get(guildDocument.honeypotChannel);

        await channel?.delete("User removed honeypot channel.").catch(Logger.error);

        guildDocument.honeypotChannel = undefined;
        await guildDocument.save();

        return await interaction.editReply("I've removed the honeypot channel from the server.");
    }
}

export { HoneypotRemoveCommand as Command };
