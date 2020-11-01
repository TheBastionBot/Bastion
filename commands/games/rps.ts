/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class RockPaperScissorCommand extends Command {
    private choices: string[];

    constructor() {
        super("rps", {
            description: "It allows you to play Rock Paper Scissor with Bastion. It also supports gambling.",
            triggers: [ "rockPaperScissor" ],
            arguments: {
                boolean: [ "bet" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "rps CHOICE",
                "rps CHOICE --bet",
            ],
        });

        this.choices = [ "ROCK", "PAPER", "SCISSOR" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const userChoice = argv._.join("").toUpperCase();

        if (!this.choices.includes(userChoice)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const isAprilFoolsDay = new Date().getMonth() === 3 && new Date().getDate() === 1;

        // find bastion's choice
        const bastionChoice: string = isAprilFoolsDay ? "ROCK" : this.choices[Math.floor(Math.random() * this.choices.length)];

        // find the result
        const result = userChoice === bastionChoice
            ? "Damn! It's a draw, mate."
            : userChoice === "ROCK" && bastionChoice === "SCISSOR"
                ? "You win, human."
                : userChoice === "PAPER" && bastionChoice === "ROCK"
                    ? isAprilFoolsDay
                        ? "I understand that scissors can beat paper. And I get how rock can beat scissors. But there's no way paper can beat rock. Paper is supposed to magically wrap around rock leaving it immobile? Why can't paper do this to scissors? Forget scissors, why can't paper do this to people? Why aren't sheets of notebook constantly suffocating students as they attempt to take notes in class? I'll tell you why. Because paper can't beat anybody. A rock would tear it up in seconds. When I play rock paper scissor, I always choose rock. And if you claim to have beaten me with your paper I will punch you in the face with my already chenched fist and say, \"oh sorry, i thought paper would protect you.\""
                        : "You win, human."
                    : userChoice === "SCISSOR" && bastionChoice === "PAPER"
                        ? "You win, human."
                        : "I win! Sorry, human. :yum:";

        // gambling
        if (argv.bet) {
            if ((message.guild as BastionGuild).document.gambling && (message.guild as BastionGuild).document.gambling.enabled) {
                if (result === "You win, human.") {
                    (message.member as BastionGuildMember).credit(42 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Won the bet in RPS.");
                } else {
                    (message.member as BastionGuildMember).debit(42 * ((message.guild as BastionGuild).document.gambling.multiplier || 1), "Lost the bet in RPS.");
                }
            } else {
                throw new Error("GAMBLING_DISABLED");
            }
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Rock Paper Scrissor",
                description: "I chose **" + bastionChoice + "**, You chose **" + userChoice + "**. " + result,
            },
        });
    }
}
