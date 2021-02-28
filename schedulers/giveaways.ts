/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Constants, Logger, Scheduler } from "@bastion/tesseract";
import { Snowflake, TextChannel, User } from "discord.js";

import GiveawayModel from "../models/Giveaway";

export = class GiveawayScheduler extends Scheduler {
    constructor() {
        super("giveaways", {
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

            // identify giveaways which've reached their timeout
            const giveawayDocuments = await GiveawayModel.find({
                $or: this.client.guilds.cache.map(g => ({ guild: g.id })),
                ends: {
                    $lte: new Date(),
                },
            });

            const completed: Snowflake[] = [];

            for (const giveawayDocument of giveawayDocuments) {
                // identify the guild for the giveaway
                const guild = this.client.guilds.cache.get(giveawayDocument.guild);

                if (guild.channels.cache.has(giveawayDocument.channel)) {
                    // identify the channel for the giveaway
                    const channel = guild.channels.cache.get(giveawayDocument.channel) as TextChannel;

                    // identify the giveaway message
                    const giveawayMessage = await channel.messages.fetch(giveawayDocument._id).catch(() => {
                        // this error can be ignored
                    });

                    if (!giveawayMessage) continue;

                    // identify giveaway participants
                    let participants: User[] = [];
                    for (const reaction of [ "🎊", "🎉" ]) {
                        if (giveawayMessage.reactions.cache.has(reaction)) {
                            // fetch participants
                            await giveawayMessage.reactions.cache.get(reaction).users.fetch().catch(() => {
                                // this error can be ignored
                            });

                            // store participants
                            participants.push(...giveawayMessage.reactions.cache.get(reaction).users.cache.filter(u => !u.bot).values());
                        }
                    }

                    // find giveaway winners
                    const winners: User[] = [];

                    for (let i = 0; i < (giveawayDocument.winners || 1); i++) {
                        if (!participants.length) break;

                        // get a random participant as the winner
                        const winner = participants[Math.floor(Math.random() * participants.length)];

                        // add them to the winners list
                        winners.push(winner);

                        // and remove them from the participants list,
                        // so that the next winners pool won't have them again
                        participants = participants.filter(p => p.id !== winner.id);
                    }

                    // announce the result
                    if (winners.length) {
                        await giveawayMessage.edit({
                            embed: {
                                color: Constants.COLORS.SOMEWHAT_DARK,
                                author: {
                                    name: "GIVEAWAY ENDED",
                                },
                                title: giveawayMessage.embeds[0].title,
                                description: "The following users have won the giveaway and will be contacted soon for their rewards.\nThank you everyone for participating. Better luck next time.",
                                fields: [
                                    {
                                        name: "Congratulations",
                                        value: winners.join(", "),
                                    },
                                ],
                                footer: {
                                    text: giveawayMessage.id,
                                },
                                timestamp: new Date(),
                            },
                        }).then(() => {
                            // mark this giveaway as complete
                            completed.push(giveawayMessage.id);
                        }).catch(() => {
                            // this error can be ignored
                        });
                    } else {
                        await giveawayMessage.edit({
                            embed: {
                                color: Constants.COLORS.RED,
                                author: {
                                    name: "GIVEAWAY ENDED",
                                },
                                title: giveawayMessage.embeds[0].title,
                                description: "Unfortunately, no one participated in this giveaway and therfore there aren't any winners this time.",
                                footer: {
                                    text: giveawayMessage.id,
                                },
                                timestamp: new Date(),
                            },
                        }).then(() => {
                            // mark this giveaway as complete
                            completed.push(giveawayMessage.id);
                        }).catch(() => {
                            // this error can be ignored
                        });
                    }
                }
            }

            // remove the completed giveaways
            if (completed.length) {
                await GiveawayModel.deleteMany({
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
