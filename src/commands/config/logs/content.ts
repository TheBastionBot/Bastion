/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../../models/Guild";

class LogContentCommand extends Command {
    constructor() {
        super({
            name: "content",
            description: "Configure whether deleted and edited message content should be shown in server logs.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const guildDocument = await GuildModel.findById(interaction.guildId);

        if (guildDocument.serverLogChannel) {
            // toggle message content logs
            guildDocument.serverLogContent = guildDocument.serverLogContent ? undefined : true;

            await guildDocument.save();
            return await interaction.editReply(`I've ${ guildDocument.serverLogContent ? "enabled" : "disabled" } message content in server logs.`);
        }

        return await interaction.editReply("You need to enable logging of server events before you can enable logging of message content.");
    }
}

export = LogContentCommand;
