/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class FlipCommand extends Command {
    private choices: string[];

    constructor() {
        super("rps", {
            description: "It allows you to play Rock Paper Scissor with Bastion.",
            triggers: [ "rockPaperScissor" ],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "rps CHOICE",
            ],
        });

        this.choices = [ "ROCK", "PAPER", "SCISSOR" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const userChoice = argv._.join("").toUpperCase();

        if (!this.choices.includes(userChoice)) throw new errors.CommandSyntaxError(this.name);

        // find bastion's choice
        const bastionChoice: string = this.choices[Math.floor(Math.random() * this.choices.length)];

        // find the result
        const result = userChoice === bastionChoice
            ? "Damn! It's a draw, mate."
            : userChoice === "ROCK" && bastionChoice === "SCISSOR"
                ?  "You win, human."
                : userChoice === "PAPER" && bastionChoice === "ROCK"
                    ? "You win, human."
                    : userChoice === "SCISSOR" && bastionChoice === "PAPER"
                        ? "You win, human."
                        : "I win! Sorry, human. :yum:";

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
