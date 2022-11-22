/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class OverwatchCommand extends Command {
    constructor() {
        super({
            name: "overwatch",
            description: "Check stats of any Overwatch player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The BattleTag or username of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "platform",
                    description: "The platform of the player.",
                    choices: [
                        { name: "PC", value: "pc" },
                        { name: "PlayStation", value: "psn" },
                        { name: "Xbox", value: "xbl" },
                        { name: "Nintendo Switch", value: "switch" },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.reply({
            content: "With the release of Overwatch 2 the APIs used to get the stats of players doesn't work anymore. This command will be available as soon as Blizzard releases new ways to see stats for Overwatch 2 players.",
            ephemeral: true,
        });
    }
}

export = OverwatchCommand;
