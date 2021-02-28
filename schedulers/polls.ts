/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, Logger, Scheduler } from "@bastion/tesseract";
import { Snowflake, TextChannel } from "discord.js";

import PollModel from "../models/Poll";

export = class PollScheduler extends Scheduler {
    constructor() {
        super("polls", {
            // every 15th minute
            cronTime: "0 */15 * * * *",
        });
    }

    exec = async (): Promise<void> => {
        try {
            // check whether the client is ready
            if (!this.client.readyTimestamp) return;

            // check whether the guild cache is empty
            if (!this.client.guilds.cache.size) return;

            // identify polls which've reached their timeout
            const pollDocuments = await PollModel.find({
                $or: this.client.guilds.cache.map(g => ({ guild: g.id })),
                ends: {
                    $lte: new Date(),
                },
            });

            const completed: Snowflake[] = [];

            for (const pollDocument of pollDocuments) {
                // identify the guild for the poll
                const guild = this.client.guilds.cache.get(pollDocument.guild);

                if (guild.channels.cache.has(pollDocument.channel)) {
                    // identify the channel for the poll
                    const channel = guild.channels.cache.get(pollDocument.channel) as TextChannel;

                    // identify the poll message
                    const pollMessage = await channel.messages.fetch(pollDocument._id).catch(() => {
                        // this error can be ignored
                    });

                    if (!pollMessage) continue;

                    // identify poll options
                    const options = pollMessage.embeds[0].fields.map(f => f.value);

                    // identify poll votes
                    const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲" ];
                    const votes: { [key: string]: number } = {};
                    let totalVotes = 0;

                    for (const key in reactions.slice(0, options.length)) {
                        if (pollMessage.reactions.cache.has(reactions[key])) {
                            // fetch voters
                            await pollMessage.reactions.cache.get(reactions[key]).users.fetch().catch(() => {
                                // this error can be ignored
                            });

                            // calculate votes
                            const votesCount = pollMessage.reactions.cache.get(reactions[key]).users.cache.filter(u => !u.bot).size;
                            votes[reactions[key]] = votesCount;
                            totalVotes += votesCount;
                        }
                    }

                    // declare poll results
                    await pollMessage.edit({
                        embed: {
                            color: Constants.COLORS.SOMEWHAT_DARK,
                            author: {
                                name: "POLL ENDED",
                            },
                            title: pollMessage.embeds[0].title,
                            fields: pollMessage.embeds[0].fields.map(f => ({
                                name: f.name + " " + f.value,
                                value: (votes[f.name] || 0) + " / " + totalVotes + " votes (" + (votes[f.name] ? votes[f.name] / totalVotes * 100 : 0).toFixed(2) + "%)",
                            })),
                            footer: {
                                text: "Ended"
                            },
                            timestamp: new Date(),
                        },
                    }).then(() => {
                        // mark this poll as complete
                        completed.push(pollMessage.id);
                    }).catch(() => {
                        // this error can be ignored
                    });
                }
            }

            // remove the completed polls
            if (completed.length) {
                await PollModel.deleteMany({
                    $or: completed.map(id => ({ _id: id })),
                }).catch(() => {
                    // this error can be ignored
                });
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}
