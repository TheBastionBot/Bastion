/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class RockPaperScissorCommand extends Command {
    private choices: string[];

    constructor() {
        super("magic8ball", {
            description: "It allows you to get answers to your polar questions from the Magic 8 Ball.",
            triggers: [ "8ball" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "magic8ball QUESTION",
            ],
        });

        this.choices = [
            "It's certain",
            "It's decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful",
        ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.INDIGO,
                title: "Magic 8-ball says...",
                description: "🎱 " + this.choices[Math.floor(Math.random() * this.choices.length)],
                footer: {
                    text: message.author.tag + " asked '" + argv._.join(" ") + "'.",
                },
            },
        });
    };
}
