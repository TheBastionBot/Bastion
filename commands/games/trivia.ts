/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import { decode as decodeEntities } from "he";

import * as arrays from "../../utils/arrays";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Trivia = require("trivia-api");
const trivia = new Trivia({ encoding: "base64" });

export = class TriviaCommand extends Command {
    constructor() {
        super("trivia", {
            description: "Play a game of trivia and see if you can answer the questions of various difficulty across multiple categories.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // fetch a random trivia
        const response = await trivia.getQuestions();
        const result = response.results[0];

        const answers = arrays.shuffle(result.incorrect_answers.concat(result.correct_answer));

        // send the question
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Trivia Question for " + message.member.displayName,
                description: "**Q. " + decodeEntities(result.question) + "**\n\n" + answers.map((answer, i) => (i + 1) + ". " + answer).join("\n"),
                fields: [
                    {
                        name: "Difficulty",
                        value: result.difficulty,
                        inline: true,
                    },
                    {
                        name: "Category",
                        value: result.category,
                        inline: true,
                    },
                ],
                footer: {
                    text: "You have 20 seconds to answer the question."
                },
            },
        });

        const collected = await message.channel.awaitMessages(m => m.author.id === message.author.id && [ "1", "2", "3", "4" ].includes(m.content), { max: 1, time: 2e4 });

        if (collected.size) {
            const index = Number.parseInt(collected.first().content) - 1;
            if (answers[index] === result.correct_answer) {
                // correct answer
                await message.channel.send({
                    embed: {
                        color: Constants.COLORS.GREEN,
                        description: "You're absolutely right " + message.member.displayName + "! That was the correct answer.",
                    },
                });
            } else {
                // incorrect answer
                await message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        description: "You're wrong, " + message.member.displayName + "! The correct answer is **" + result.correct_answer + "**.",
                    },
                });
            }
        } else {
            // no answer
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: "Hey, " + message.member.displayName + "! 20 seconds isn't enough for you?",
                },
            });
        }
    }
}
