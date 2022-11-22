/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class StreamerRoleCommand extends Command {
    constructor() {
        super({
            name: "streamer-role",
            description: "Set the role someone is assigned in the server when they start streaming.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role that should be assigned to users.",
                },
            ],
            userPermissions: [ PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const role = interaction.options.getRole("role");

        if (role?.id === interaction.guildId) {
            return await interaction.editReply("**@everyone** isn't a valid role for this.");
        }

        const guildDocument = await GuildModel.findById(interaction.guildId);

        // update streamer role
        guildDocument.streamerRole = role?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ role?.id ? "set" : "disabled" } the streamer role${ role?.id ? ` to **${ role.name }**` : "" }.`);
    }
}

export = StreamerRoleCommand;
