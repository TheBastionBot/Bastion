/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import GuildModel from "../../models/Guild";

class VerificationCommand extends Command {
    constructor() {
        super({
            name: "verification",
            description: "Configure verification in the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "The role that should be assigned to verified users.",
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

        // update verified role
        guildDocument.verifiedRole = role?.id || undefined;

        await guildDocument.save();
        return await interaction.editReply(`I've ${ role?.id ? "enabled" : "disabled" } verification${ role?.id ? ` and **${ role.name }** is the verified role` : "" } in the server.`);
    }
}

export = VerificationCommand;
