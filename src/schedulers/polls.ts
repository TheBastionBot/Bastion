/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildTextBasedChannel, Snowflake } from "discord.js";
import { Logger, Scheduler } from "@bastion/tesseract";

import PollModel from "../models/Poll.js";
import { COLORS } from "../utils/constants.js";

class PollScheduler extends Scheduler {
    constructor() {
        super("polls", "0 */15 * * * *");   // every 15th minute
    }

    public async exec(): Promise<void> {
        try {
            // check whether the client is ready
            if (!this.client.isReady()) return;

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

                if (guild?.channels?.cache.has(pollDocument.channel)) {
                    // identify the channel for the poll
                    const channel = guild.channels.cache.get(pollDocument.channel) as GuildTextBasedChannel;

                    // identify the poll message
                    const pollMessage = await channel.messages.fetch(pollDocument.id).catch(Logger.ignore);

                    if (pollMessage) {
                        // check if poll has ended
                        if (pollMessage.embeds[0].author.name?.includes("ENDED")) {
                            // mark this poll as complete
                            completed.push(pollMessage.id);
                            continue;
                        }

                        // identify poll options
                        const options = pollMessage.embeds[0].fields.map(f => f.value);

                        // identify poll votes
                        const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲" ];
                        const votes: { [key: string]: number } = {};

                        let totalVotes = 0;
                        for (const key in reactions.slice(0, options.length)) {
                            if (pollMessage.reactions.cache.has(reactions[key])) {
                                // calculate votes
                                const votesCount = pollMessage.reactions.cache.get(reactions[key]).count;
                                votes[reactions[key]] = votesCount - 1;
                                totalVotes += votes[reactions[key]];
                            }
                        }

                        // declare poll results
                        await pollMessage.edit({
                            embeds: [
                                {
                                    color: COLORS.SOMEWHAT_DARK,
                                    author: {
                                        name: "POLL ENDED",
                                    },
                                    title: pollMessage.embeds[0].title,
                                    fields: pollMessage.embeds[0].fields.sort((a, b) => (votes[b.name] || 0) - (votes[a.name] || 0) ).map(f => ({
                                        name: f.value,
                                        value: `${ votes[f.name] || 0 } votes — ${ ((votes[f.name] || 0) / totalVotes * 100).toFixed(0) }%`,
                                    })),
                                    footer: {
                                        text: `${ totalVotes } votes`
                                    },
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                        }).then(() => {
                            // mark this poll as complete
                            completed.push(pollMessage.id);
                        }).catch(Logger.ignore);
                    } else {
                        // mark this poll as complete
                        completed.push(pollDocument.id);
                    }
                }
            }

            // remove the completed polls
            if (completed.length) {
                await PollModel.deleteMany({
                    $or: completed.map(id => ({ _id: id })),
                }).catch(Logger.error);
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}

export { PollScheduler as Scheduler };
