/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Collection, Message, Snowflake } from "discord.js";

import * as numbers from "../../utils/numbers";


interface Submission {
    backronym: string;
    user: Snowflake;
}

interface Game {
    votes: Snowflake[];
}


export = class AcrophobiaCommand extends Command {
    private games: Map<Snowflake, Game>;

    constructor() {
        super("acrophobia", {
            description: "It allows you to play the Acrophobia game with your fellow server members. Bastion generates a random acronym and players compete by racing to create the most coherent or humorous sentence that fits the acronym - a backronym. After the submissions are over, in the specified amount of time, everyone then votes anonymously for their favorite answer. The most popular backronym wins.",
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

        this.games = new Map<Snowflake, Game>();
    }

    handleVoting = (message: Message): void => {
        this.games.get(message.channel.id).votes.push(message.author.id);

        // delete the voting message
        if (message.deletable) {
            message.delete().catch(() => {
                // this error can be ignored
            });
        }
    }

    handleVotingEnd = (message: Message, submissions: Submission[], collected: Collection<Snowflake, Message>): Promise<unknown> => {
        // remove the game as active game
        this.games.delete(message.channel.id);

        // check whether votes were given to the submissions
        if (collected.size === 0) {
            return message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    author: {
                        name: "Acrophobia",
                    },
                    title: "Game Ended",
                    description: "Unfortunately, no votes were given to any of the submissions.",
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // calculate the votes
        const votes: { [key: string]: number } = {};

        for (const vote of collected.values()) {
            votes[vote.content] = votes[vote.content] ? votes[vote.content] + 1 : 1;
        }

        // find the winner
        const winnerIndex = +Object.keys(votes).reduce((acc, curr) => {
            return votes[acc] > votes[curr] ? acc : curr;
        }) - 1;

        const winner: string = this.client.users.cache.has(submissions[winnerIndex].user) ? this.client.users.cache.get(submissions[winnerIndex].user).tag : submissions[winnerIndex].user;

        // announce the winner
        message.channel.send({
            embed: {
                color: Constants.COLORS.SOMEWHAT_DARK,
                author: {
                    name: "Acrophobia",
                },
                title: "Game Ended",
                description: winner + " won with " + votes[winnerIndex] + " votes for the backronym " + submissions[winnerIndex].backronym + ".",
            },
        }).catch(() => {
            // this error can be ignored
        });
    }

    handleSubmission = (message: Message): void => {
        // delete the submission message
        if (message.deletable) {
            message.delete().catch(() => {
                // this error can be ignored
            });
        }
    }

    handleSubmissionEnd = async (message: Message, collected: Collection<Snowflake, Message>): Promise<unknown> => {
        try {
            // check whether enough submissions were made
            if (collected.size < 2) {
                // remove the game as active game
                this.games.delete(message.channel.id);

                return message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        author: {
                            name: "Acrophobia",
                        },
                        title: "Game Ended",
                        description: "Unfortunately, " + (collected.size === 0 ? "no submissions were" : "only one submission was")  + " made for the acronym.",
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            // open voting for submissions
            const time = 2;

            const submissions: Submission[] = [ ...collected.values() ].map(m => ({
                backronym: m.content,
                user: m.author.id,
            }));

            await message.channel.send({
                embed: {
                    color: Constants.COLORS.INDIGO,
                    author: {
                        name: "Acrophobia",
                    },
                    title: "Submissions",
                    description: submissions.map((m, i) => "**#" + (i + 1) + "** - " + m.backronym).join("\n"),
                    footer: {
                        text: "Vote by typing the corresponding number of your favorite backronym. Voting closes in " + time + " minutes.",
                    },
                },
            });

            // collect votes
            const votes = message.channel.createMessageCollector(
                m => !m.author.bot && Number.parseInt(m.content) > 0 && Number.parseInt(m.content) <= submissions.length && !(this.games.has(message.channel.id) && this.games.get(message.channel.id).votes.includes(m.author.id)),
                { time: time * 6e4 },
            );

            // handle votes
            votes.on("collect", this.handleVoting);
            votes.on("end", collected => this.handleVotingEnd(message, submissions, collected));
        } catch {
            // remove the game as active game
            this.games.delete(message.channel.id);
        }
    }

    exec = async (message: Message): Promise<void> => {
        const time = 2;

        // generate the acronym size
        const size = numbers.getRandomInt(3, 7);

        // char pool
        const ALPHABETS: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        // generate the acronym
        const acronym: string[] = [];
        for (let index = 0; index < size; index++) {
            acronym.push(ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)]);
        }

        // start the game
        const startMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.INDIGO,
                title: "Acrophobia",
                description: message.author.tag + " started an acrophobia game in this channel. Create a coherent or humorous sentence for the acronym **" + acronym.join(" ") + "**.",
                footer: {
                    text: "You have got " + time + " minutes to make your submission.",
                },
            },
        });

        // initialize current game
        this.games.set(message.channel.id, {
            votes: [],
        });

        // collect submissions
        const submission = message.channel.createMessageCollector(
            m => !m.author.bot && m.content.length > (2 * acronym.length) && m.content.split(" ").length === size && m.content.split(" ").map((w: string) => w[0]).join("").toUpperCase() === acronym.join(""),
            {
                time: time * 6e4,
                max: 25,
            },
        );

        // handle submissions
        submission.on("collect", this.handleSubmission);
        submission.on("end", collected => this.handleSubmissionEnd(startMessage, collected));
    }
}
