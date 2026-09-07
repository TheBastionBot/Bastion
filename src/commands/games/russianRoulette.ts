/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command, Logger } from "@bastion/tesseract";

class RussianRouletteCommand extends Command {
    private outcomes: string[];

    constructor() {
        super({
            name: "russian-roulette",
            description: "Play a game of Russian roulette.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "rounds",
                    description: "The number rounds you want to play.",
                    min_value: 1,
                    max_value: 6,
                },
            ],
        });

        this.outcomes = [
            "🔫 BANG! It's over, buddy.",
            "You got lucky, human.",
        ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const rounds = interaction.options.getInteger("rounds") || 1;

        for (let index = 0; index < rounds; index++) {
            const outcome = this.outcomes[Math.floor(Math.random() * this.outcomes.length)];

            if (interaction.replied) await interaction.followUp(outcome).catch(Logger.ignore);
            else await interaction.reply(outcome).catch(Logger.ignore);

            // check whether the game is over
            if (outcome.includes("BANG")) break;
        }
    }
}

export { RussianRouletteCommand as Command };
