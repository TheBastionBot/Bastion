/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as numbers from "../../utils/numbers";

export = class RussianRouletteCommand extends Command {
    private outcomes: string[];

    constructor() {
        super("russianRoulette", {
            description: "It allows you to play Russian Roulette. Let's see if you can last all the 7 rounds.",
            triggers: [ "rockPaperScissor" ],
            arguments: {
                alias: {
                    rounds: [ "r" ],
                },
                number: [ "rounds" ],
                coerce: {
                    rounds: (arg): number => Math.floor(numbers.clamp(arg, 1, 7)) || 1,
                },
                default: {
                    rounds: 1,
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "rps",
                "rps --rounds ROUNDS",
            ],
        });

        this.outcomes = [
            "🔫 BANG! It's over, buddy.",
            "You got lucky, human.",
        ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        for (let round = 1; round <= argv.rounds; round++) {
            const outcome: string = this.outcomes[Math.floor(Math.random() * this.outcomes.length)];

            // check whether the game is over
            const isGameOver: boolean = outcome.includes("BANG");

            // acknowledge
            await message.channel.send({
                embed: {
                    color: isGameOver ? Constants.COLORS.RED : Constants.COLORS.IRIS,
                    title: "Russian Roulette",
                    description: outcome,
                },
            });

            // if game is over, terminate it
            if (isGameOver) break;
        }
    }
}
