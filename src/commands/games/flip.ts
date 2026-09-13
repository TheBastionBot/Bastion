/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { credit, stake } from "../../utils/economy.js";
import { flipOdds, MIN_WAGER, winnings } from "../../utils/gambling.js";

enum Outcomes {
    Heads = "Heads",
    Tails = "Tails",
}

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
                {
                    type: ApplicationCommandOptionType.String,
                    name: "call",
                    description: `What you think the majority will land on. Bets ${ MIN_WAGER } coins unless you set a wager.`,
                    choices: [
                        { name: "Heads", value: Outcomes.Heads },
                        { name: "Tails", value: Outcomes.Tails },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "wager",
                    description: "The Bastion Coins you want to bet on your call.",
                    min_value: MIN_WAGER,
                },
            ],
        });

        this.outcomes = [ Outcomes.Heads, Outcomes.Tails ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const coins = interaction.options.getInteger("coins") || 1;
        const call = interaction.options.getString("call");
        const wager = interaction.options.getInteger("wager") || (call ? MIN_WAGER : null);

        const text = (key: string, variables?: Record<string, string | number>): string =>
            (interaction.client as Client).locales.getText(interaction.guildLocale, key, variables);

        if (wager && !call) return await interaction.reply({ content: text("wagerCallRequired"), flags: MessageFlags.Ephemeral });

        if (wager) {
            await interaction.deferReply();

            const refusal = await stake(interaction.user.id, interaction.guildId, wager);
            if (refusal) return await interaction.editReply(text(refusal, { wager: wager.toLocaleString() }));
        }

        const outcomes: string[] = [];
        for (let index = 0; index < coins; index++) {
            outcomes.push(this.outcomes[Math.floor(Math.random() * this.outcomes.length)]);
        }

        const flips = outcomes.join(" / ");

        if (!wager) return await interaction.reply(flips);

        const called = outcomes.filter(o => o === call).length;
        const { win, refund } = flipOdds(coins);

        let reward = 0;
        let result: string;

        if (called * 2 === coins) {
            reward = wager;
            result = text("wagerRefunded", { wager: wager.toLocaleString() });
        } else if (called * 2 > coins) {
            reward = winnings(wager, win, refund);
            result = text("wagerWon", { winnings: reward.toLocaleString() });
        } else {
            result = text("wagerLost", { wager: wager.toLocaleString() });
        }

        if (reward) await credit(interaction.user.id, interaction.guildId, reward);

        await interaction.editReply(`${ flips }\n-# You called **${ call }**. ${ result }`);
    }
}

export { FlipCommand as Command };
