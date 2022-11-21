/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

class PruneCommand extends Command {
    constructor() {
        super({
            name: "prune",
            description: "Kicks the inactive members (without any roles) from the server.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "days",
                    description: "The number of days of inactivity required for kicking.",
                    min_value: 1,
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: "role",
                    description: "Inactive members check includes this role.",
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for pruning the inactive members.",
                },
            ],
            clientPermissions: [ PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageGuild ],
            userPermissions: [ PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageGuild ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();
        const days = interaction.options.getInteger("days");
        const role = interaction.options.getRole("role");
        const reason = interaction.options.getString("reason");

        const pruned = await interaction.guild.members.prune({
            count: !interaction.guild.large,
            days: days ?? 7,
            roles: role ? [ role ] : [],
            reason,
        });

        await interaction.editReply(`I've pruned ${ pruned || "the" } inactive members from the server.`);
    }
}

export = PruneCommand;
