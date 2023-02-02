/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";
import { isPublicBastion } from "../../utils/constants.js";
import { isPremiumUser } from "../../utils/premium.js";

class MusicCommand extends Command {
    constructor() {
        super({
            name: "music",
            description: "Configure music in the server.",
            options: [],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // check for premium membership
        if (isPublicBastion(interaction.client.user.id)) {
            if (!await isPremiumUser(interaction.guild.ownerId)) {
                return interaction.editReply("Music is only enabled in Premium Servers in the Public Bastion.");
            }
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update music channel
        guildDocument.music = !guildDocument.music;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ guildDocument.music ? "enabled" : "disabled" } music in the server.`);
    }
}

export { MusicCommand as Command };
