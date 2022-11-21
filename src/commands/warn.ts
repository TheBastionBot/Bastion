/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "@bastion/tesseract";

import { addInfraction, manageable } from "../utils/members";

class WarnCommand extends Command {
    constructor() {
        super({
            name: "warn",
            description: "Warn server members and add infractions to their server profile.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user you want to warn.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "reason",
                    description: "The reason for the warning.",
                    required: true,
                },
            ],
            userPermissions: [ PermissionFlagsBits.ModerateMembers ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const member = await interaction.guild.members.fetch(user);

        if (manageable(interaction.member, member)) {
            // add infraction to the member
            await addInfraction(member, reason);

            return await interaction.editReply(`${ user } received a warning for **${ reason }**.`);
        }

        return await interaction.editReply({
            content: `You don't have permission to warn ${ user }.`,
        });
    }
}

export = WarnCommand;
