/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command, Logger } from "@bastion/tesseract";

import { credit, stake } from "../../utils/economy.js";
import { MIN_WAGER, winnings } from "../../utils/gambling.js";

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
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "wager",
                    description: "The Bastion Coins you want to bet on surviving every round.",
                    min_value: MIN_WAGER,
                },
            ],
        });

        this.outcomes = [
            "🔫 BANG! It's over, buddy.",
            "You got lucky, human.",
        ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const rounds = interaction.options.getInteger("rounds") || 1;
        const wager = interaction.options.getInteger("wager");

        const text = (key: string, variables?: Record<string, string | number>): string =>
            (interaction.client as Client).locales.getText(interaction.guildLocale, key, variables);

        if (wager) {
            await interaction.deferReply();

            const refusal = await stake(interaction.user.id, interaction.guildId, wager);
            if (refusal) return await interaction.editReply(text(refusal, { wager: wager.toLocaleString() }));
        }

        const played: string[] = [];
        let survived = true;

        for (let index = 0; index < rounds && survived; index++) {
            const outcome = this.outcomes[Math.floor(Math.random() * this.outcomes.length)];
            played.push(outcome);

            survived = !outcome.includes("BANG");
        }

        const reward = wager && survived ? winnings(wager, 0.5 ** rounds) : 0;

        if (reward) await credit(interaction.user.id, interaction.guildId, reward);

        for (const outcome of played) {
            if (interaction.replied) await interaction.followUp(outcome).catch(Logger.ignore);
            else if (interaction.deferred) await interaction.editReply(outcome).catch(Logger.ignore);
            else await interaction.reply(outcome).catch(Logger.ignore);
        }

        if (!wager) return;

        await interaction.followUp(survived
            ? text("wagerWon", { winnings: reward.toLocaleString() })
            : text("wagerLost", { wager: wager.toLocaleString() })).catch(Logger.ignore);
    }
}

export { RussianRouletteCommand as Command };
