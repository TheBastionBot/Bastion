/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as numbers from "../../utils/numbers";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class RollCommand extends Command {
    private pattern: RegExp;
    private modifierPattern: RegExp;

    constructor() {
        super("roll", {
            description: "It allows you to roll dice and see the result. It supports dice notation. It also supports gambling.",
            triggers: [],
            arguments: {
                number: [ "bet" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "roll",
                "roll NOTATION",
                "roll --bet RESULT",
            ],
        });

        this.pattern = /^(\d+)?(?:d(\d*))?([-+x*/]\d+)?([-+x*/]\d+)?$/i;
        this.modifierPattern = /^([-+x*/])(\d+)$/i;
    }

    private applyModifier = (result: number, modifier: string): number => {
        const [ , type, value ] = modifier.match(this.modifierPattern);

        switch (type.toLowerCase()) {
        case "+":
            return result + Number.parseInt(value);
        case "-":
            return result - Number.parseInt(value);
        case "/":
            return result / Number.parseInt(value);
        case "*":
        case "x":
            return result * Number.parseInt(value);
        default:
            return result;
        }
    }

    private applyModifiers = (result: number, modifiers: string[]): number => {
        for (const modifier of modifiers) {
            result = this.applyModifier(result, modifier);
        }
        return result;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const [ , d, f, ...modifiers ] = argv._.join("").match(this.pattern);

        // set defaults
        const dice: number = d ? Number.parseInt(d) : 1;
        const faces: number = f ? Number.parseInt(f) : 6;

        // generate the outcome
        const outcomes: number[] = [];
        for (let index = 0; index < dice; index++) {
            outcomes.push(numbers.getRandomInt(1, faces));
        }

        // calculate the result
        let result: number = outcomes.reduce((acc, curr) => acc + curr, 0);

        const fields = [];

        if (modifiers.filter(m => m).length) {
            fields.push({
                name: "Modifiers",
                value: modifiers.join(" "),
                inline: true,
            });

            result = this.applyModifiers(result, modifiers.filter(m => m));
        }

        // gambling
        if (argv.bet) {
            if ((message.guild as BastionGuild).document.gambling && (message.guild as BastionGuild).document.gambling.enabled) {
                if (result === argv.bet) {
                    (message.member as BastionGuildMember).credit(100 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Won the bet in Roll.");
                } else {
                    (message.member as BastionGuildMember).debit(100 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Lost the bet in Roll.");
                }
            } else {
                throw new Error("GAMBLING_DISABLED");
            }
        }

        fields.push({
            name: "Result",
            value: result,
            inline: true,
        });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Dice Roll",
                description: outcomes.join(" / "),
                fields,
            },
        });
    }
}
