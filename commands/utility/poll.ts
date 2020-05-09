/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, TextChannel } from "discord.js";

import PollModel from "../../models/Poll";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";

export = class PollCommand extends Command {
    /** The default poll vote reactions */
    private reactions: string[];
    /** The default timeout of the poll, in hours. */
    private defaultTimeout: number;

    constructor() {
        super("poll", {
            description: "It allows you to run polls in the server for at least an hour and at most a month. You can set at most 13 options for the poll. It also allows you to see the status of a running poll.",
            triggers: [],
            arguments: {
                alias: {
                    timeout: [ "t" ],
                    option: [ "o" ],
                    status: [ "s" ],
                },
                number: [ "timeout" ],
                string: [ "option", "status" ],
                coerce: {
                    timeout: (arg): number => typeof arg === "number" && numbers.clamp(arg, 1, 720),
                },
                default: {
                    timeout: 3,
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_CHANNELS" ],
            syntax: [
                "poll --status POLL_MESSAGE_ID",
                "poll --option OPTIONS... -- QUESTION",
                "poll --timeout HOURS --option OPTIONS... -- QUESTION",
            ],
        });

        this.reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲" ];
        this.defaultTimeout = 3;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // check poll status
        if (argv.status) {
            // find the poll document
            const pollDocument = await PollModel.findOne({
                _id: argv.status,
                guild: message.guild.id,
            });

            // check whether the poll exists
            if (!pollDocument) throw new Error("POLL_NOT_FOUND");

            // identify the channel for the poll
            if (!message.guild.channels.cache.has(pollDocument.channel)) throw new Error("POLL_NOT_FOUND");
            const channel = message.guild.channels.cache.get(pollDocument.channel) as TextChannel;

            // identify the poll message
            const pollMessage = await channel.messages.fetch(pollDocument._id).catch(() => {
                // this error can be ignored
            });

            if (!pollMessage) throw new Error("POLL_NOT_FOUND");

            // identify poll options
            const options = pollMessage.embeds[0].fields.map(f => f.value);

            // identify poll votes
            const votes: { [key: string]: number } = {};
            let totalVotes = 0;

            for (const key in this.reactions.slice(0, options.length)) {
                if (pollMessage.reactions.cache.has(this.reactions[key])) {
                    // fetch voters
                    await pollMessage.reactions.cache.get(this.reactions[key]).users.fetch().catch(() => {
                        // this error can be ignored
                    });

                    // calculate votes
                    const votesCount = pollMessage.reactions.cache.get(this.reactions[key]).users.cache.filter(u => !u.bot).size;
                    votes[this.reactions[key]] = votesCount;
                    totalVotes += votesCount;
                }
            }

            // declare poll results
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    author: {
                        name: "POLL STATUS",
                    },
                    title: pollMessage.embeds[0].title,
                    fields: pollMessage.embeds[0].fields.map(f => ({
                        name: f.name + " " + f.value,
                        value: (votes[f.name] || 0) + " / " + totalVotes + " votes (" + (votes[f.name] ? votes[f.name] / totalVotes * 100 : 0).toFixed(2) + "%)",
                    })),
                    footer: {
                        text: pollMessage.id + " • Ends",
                    },
                    timestamp: pollDocument.ends,
                },
            });
        }


        if (!argv._.length || !argv.option || !argv.option.length) throw new errors.CommandSyntaxError(this.name);

        const item = argv._.join(" ");
        const timeout = argv.timeout ? argv.timeout : this.defaultTimeout;

        // calculate end date
        const expectedEndDate = new Date(Date.now() + timeout * 36e5);

        // acknowledge
        const pollMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "POLL",
                },
                title: item,
                description: "React to this message with the corresponding emoji to vote for that option.",
                fields: argv.option.map((option: string, i: number) => ({
                    name: this.reactions[i],
                    value: option,
                })),
                footer: {
                    text: "Ends"
                },
                timestamp: expectedEndDate,
            },
        });

        // create the poll
        await PollModel.create({
            _id: pollMessage.id,
            channel: pollMessage.channel.id,
            guild: pollMessage.guild.id,
            ends: expectedEndDate,
        });

        // add poll reactions
        for (const reaction of this.reactions.slice(0, argv.option.length)) {
            await pollMessage.react(reaction).catch(() => {
                // this error can be ignored
            });
        }
    }
}
