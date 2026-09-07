/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { DiscordAPIError, RESTJSONErrorCodes, Snowflake } from "discord.js";
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
                guild: { $in: [ ...this.client.guilds.cache.keys() ] },
                ends: {
                    $lte: new Date(),
                },
            });

            const completed: Snowflake[] = [];

            for (const pollDocument of pollDocuments) {
                // identify the guild for the poll
                const guild = this.client.guilds.cache.get(pollDocument.guild);

                if (!guild) continue;

                // identify the channel for the poll
                const channel = await guild.channels.fetch(pollDocument.channel).catch((e: Error) => e);

                // check whether the poll's channel is actually gone
                if (channel instanceof Error) {
                    if (channel instanceof DiscordAPIError && channel.code === RESTJSONErrorCodes.UnknownChannel) completed.push(pollDocument._id);
                    continue;
                }

                if (!channel?.isTextBased()) continue;

                // identify the poll message
                const pollMessage = await channel.messages.fetch(pollDocument._id).catch((e: Error) => e);

                // check whether the poll message is actually gone
                if (pollMessage instanceof Error) {
                    if (pollMessage instanceof DiscordAPIError && pollMessage.code === RESTJSONErrorCodes.UnknownMessage) completed.push(pollDocument._id);
                    continue;
                }

                // check if poll has ended
                if (pollMessage.embeds[0].author.name?.includes("ENDED")) {
                    // mark this poll as complete
                    completed.push(pollMessage.id);
                    continue;
                }

                // identify poll options
                const options = pollMessage.embeds[0].fields.map(f => f.value);

                // identify poll votes
                const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];
                const votes: { [key: string]: number } = {};

                let totalVotes = 0;
                for (const key in reactions.slice(0, options.length)) {
                    if (pollMessage.reactions.cache.has(reactions[key])) {
                        // calculate votes, discounting Bastion's own reaction only when it's there
                        const reaction = pollMessage.reactions.cache.get(reactions[key]);
                        votes[reactions[key]] = reaction.count - (reaction.me ? 1 : 0);
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
                                value: `${ votes[f.name] || 0 } votes — ${ totalVotes ? ((votes[f.name] || 0) / totalVotes * 100).toFixed(0) : 0 }%`,
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
            }

            // remove the completed polls
            if (completed.length) {
                await PollModel.deleteMany({
                    _id: { $in: completed },
                }).catch(Logger.error);
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}

export { PollScheduler as Scheduler };
