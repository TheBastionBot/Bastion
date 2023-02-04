/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class UserAvatarCommand extends Command {
    constructor() {
        super({
            name: "avatar",
            description: "Displays the avatar of the specified user.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user whose avatar you want to display.",
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const user = interaction.options.getUser("user") || interaction.user;

        await interaction.reply(user.displayAvatarURL({ size: 512 }));
    }
}

export { UserAvatarCommand as Command };
