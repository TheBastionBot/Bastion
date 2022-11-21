/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "@bastion/tesseract";

class FlipCommand extends Command {
    private outcomes: string[];

    constructor() {
        super({
            name: "flip",
            description: "Flip coins and see the result.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "coins",
                    description: "The number of coins to flip.",
                    min_value: 1,
                    max_value: 128,
                },
            ],
        });

        this.outcomes = [ "Heads", "Tails" ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const coins = interaction.options.getInteger("coins") || 1;

        // generate the outcome
        const outcomes: string[] = [];
        for (let index = 0; index < coins; index++) {
            outcomes.push(this.outcomes[Math.floor(Math.random() * this.outcomes.length)]);
        }

        await interaction.reply(outcomes.join(" / "));
    }
}

export = FlipCommand;
