/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as numbers from "../../utils/numbers";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class FlipCommand extends Command {
    private outcomes: string[];

    constructor() {
        super("flip", {
            description: "It allows you to flip any number of coins and see the result. It also supports gambling.",
            triggers: [],
            arguments: {
                alias: {
                    coins: [ "c" ],
                },
                array: [ "bet" ],
                number: [ "coins" ],
                string: [ "bet" ],
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
                "flip --bet OUTCOME",
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

        // gambling
        if (argv.bet && argv.bet.length) {
            if ((message.guild as BastionGuild).document.gambling && (message.guild as BastionGuild).document.gambling.enabled) {
                if (argv.bet.join(" / ").toLowerCase() === outcomes.join(" / ").toLowerCase()) {
                    (message.member as BastionGuildMember).credit(13 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Won the bet in Flip.");
                } else {
                    (message.member as BastionGuildMember).debit(13 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Lost the bet in Flip.");
                }
            } else {
                throw new Error("GAMBLING_DISABLED");
            }
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
