/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild.js";

class GamblingCommand extends Command {
    constructor() {
        super({
            name: "gambling",
            description: "Turn gambling in the server on or off.",
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        const guildDocument = await GuildModel.findById(interaction.guildId);

        guildDocument.gambling = guildDocument.gambling ? undefined : true;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ guildDocument.gambling ? "enabled" : "disabled" } gambling in the server.`);
    }
}

export { GamblingCommand as Command };
