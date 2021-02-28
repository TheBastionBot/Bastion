/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message, Snowflake } from "discord.js";

import * as errors from "../../utils/errors";


export = class NumberNashCommand extends Command {
    private games: Map<Snowflake, boolean>;

    constructor() {
        super("numberNash", {
            description: "Number Nash is a multiplayer game of numbers played with multiple members of the server. When started, everyone can post a natural number between 1 and 100 in the channel. The game ends in a minute and the member who posted the smallest number that wasn't also posted by anyone else wins.",
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

        this.games = new Map<Snowflake, boolean>();
    }

    exec = async (message: Message): Promise<void> => {
        // check whether a game is already running in the channel
        if (this.games.has(message.channel.id)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, "A game is already running in this channel. Wait for it to end before starting another.");

        // start game
        await message.channel.send({
            embed: {
                color: Constants.COLORS.INDIGO,
                title: "Number Nash",
                description: "Everyone has one minute to post a natural number between 1 and 100 in the channel. After the timer ends, the member who posted the smallest number that wasn't also posted by anyone else wins the game.",
                footer: {
                    text: "You have got 1 minute to make your submission.",
                },
            },
        });

        // initialize current game
        this.games.set(message.channel.id, true);

        // collect numbers
        const submission = message.channel.createMessageCollector(
            (m: Message) => !m.author.bot && Number.parseInt(m.content) > 0 && Number.parseInt(m.content) <= 100,
            { time: 6e4 },
        );

        submission.on("collect", (m: Message) => {
            // delete the submission message
            if (m.deletable) {
                m.delete().catch(() => {
                    // this error can be ignored
                });
            }
        });
        submission.on("end", collected => {
            if (collected.size > 1) {
                const submissions = Array.from(collected.mapValues(m => Number.parseInt(m.content)).values());
                const uniqueSubmissions = submissions.filter(num => submissions.indexOf(num) === submissions.lastIndexOf(num));

                const winningSubmission = Math.min(...uniqueSubmissions);
                const winningMessage = collected.find(m => m.content === winningSubmission.toString());

                if (winningMessage) {
                    // announce the winner
                    message.channel.send({
                        embed: {
                            color: Constants.COLORS.SOMEWHAT_DARK,
                            author: {
                                name: "Number Nash",
                            },
                            title: "Game Ended",
                            description: "**" + winningMessage.author.username + "** made the winning submission **" + winningSubmission + "**.",
                        },
                    }).catch(() => {
                        // this error can be ignored
                    });
                }
            } else {
                // no one submitted
                message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        author: {
                            name: "Number Nash",
                        },
                        title: "Game Ended",
                        description: "Unfortunately, " + (collected.size === 0 ? "no submissions were" : "only one submission was")  + " made.",
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            // delete the game
            this.games.delete(message.channel.id);
        });
    }
}
