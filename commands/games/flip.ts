/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as numbers from "../../utils/numbers";

export = class FlipCommand extends Command {
    private outcomes: string[];

    constructor() {
        super("flip", {
            description: "It allows you to flip any number of coins and see the result.",
            triggers: [],
            arguments: {
                alias: {
                    coins: [ "c" ],
                },
                number: [ "coins" ],
                coerce: {
                    coins: (arg): number => Math.floor(numbers.clamp(arg, 1, 256)),
                },
                default: {
                    coins: 1,
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "flip",
                "flip --coins NUMBER",
            ],
        });

        this.outcomes = [ "HEADS", "TAILS" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const coins = argv.coins || 1;

        // generate the outcome
        const outcomes: string[] = [];
        for (let index = 0; index < coins; index++) {
            outcomes.push(this.outcomes[Math.floor(Math.random() * this.outcomes.length)]);
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Coin Flip",
                description: outcomes.join(" / "),
            },
        });
    }
}
