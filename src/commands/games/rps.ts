/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { credit, stake } from "../../utils/economy.js";
import { MIN_WAGER, winnings } from "../../utils/gambling.js";

enum Choices {
    Rock = "ROCK",
    Paper = "PAPER",
    Scissor = "SCISSOR",
}

class RockPaperScissorCommand extends Command {
    private choices: string[];

    constructor() {
        super({
            name: "rps",
            description: "Play rock paper scissor with Bastion.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "choice",
                    description: "Your choice.",
                    choices: [
                        { name: "Rock", value: Choices.Rock },
                        { name: "Paper", value: Choices.Paper },
                        { name: "Scissor", value: Choices.Scissor },
                    ],
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "wager",
                    description: "The Bastion Coins you want to bet on your choice.",
                    min_value: MIN_WAGER,
                },
            ],
        });

        this.choices = [ Choices.Rock, Choices.Paper, Choices.Scissor ];
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        const choice = interaction.options.getString("choice");
        const wager = interaction.options.getInteger("wager");

        const text = (key: string, variables?: Record<string, string | number>): string =>
            (interaction.client as Client).locales.getText(interaction.guildLocale, key, variables);

        if (wager) {
            await interaction.deferReply();

            const refusal = await stake(interaction.user.id, interaction.guildId, wager);
            if (refusal) return await interaction.editReply(text(refusal, { wager: wager.toLocaleString() }));
        }

        const today = new Date();
        const isAprilFoolsDay = today.getMonth() === 3 && today.getDate() === 1;
        const isJoking = isAprilFoolsDay && !wager && Math.random() < 0.1;

        const bastionChoice: string = isJoking ? Choices.Rock : this.choices[Math.floor(Math.random() * this.choices.length)];

        const isDraw = choice === bastionChoice;
        const hasWon = (choice === Choices.Rock && bastionChoice === Choices.Scissor)
            || (choice === Choices.Paper && bastionChoice === Choices.Rock)
            || (choice === Choices.Scissor && bastionChoice === Choices.Paper);

        let result: string;

        if (isDraw) {
            result = "Damn! It's a draw, mate.";
        } else if (!hasWon) {
            result = "I win! Sorry, human. :yum:";
        } else if (isJoking && choice === Choices.Paper) {
            result = "I understand that scissors can beat paper. And I get how rock can beat scissors. But there's no way paper can beat rock. Paper is supposed to magically wrap around rock leaving it immobile? Why can't paper do this to scissors? Forget scissors, why can't paper do this to people? Why aren't sheets of notebook constantly suffocating students as they attempt to take notes in class? I'll tell you why. Because paper can't beat anybody. A rock would tear it up in seconds. When I play rock paper scissor, I always choose rock. And if you claim to have beaten me with your paper I will punch you in the face with my already chenched fist and say, \"oh sorry, i thought paper would protect you.\"";
        } else {
            result = "You win, human.";
        }

        const round = `I chose **${ bastionChoice }**, you chose **${ choice }**. ${ result }`;

        if (!wager) return await interaction.reply(round);

        let reward = 0;
        let settlement: string;

        if (hasWon) {
            reward = winnings(wager, 1 / 3, 1 / 3);
            settlement = text("wagerWon", { winnings: reward.toLocaleString() });
        } else if (isDraw) {
            reward = wager;
            settlement = text("wagerRefunded", { wager: wager.toLocaleString() });
        } else {
            settlement = text("wagerLost", { wager: wager.toLocaleString() });
        }

        if (reward) await credit(interaction.user.id, interaction.guildId, reward);

        await interaction.editReply(`${ round }\n-# ${ settlement }`);
    }
}

export { RockPaperScissorCommand as Command };
