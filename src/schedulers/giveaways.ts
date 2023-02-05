/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ComponentType, GuildTextBasedChannel, Snowflake, User } from "discord.js";
import { Client, Logger, Scheduler } from "@bastion/tesseract";

import GiveawayModel from "../models/Giveaway.js";
import MessageComponents from "../utils/components.js";
import { COLORS } from "../utils/constants.js";

class GiveawayScheduler extends Scheduler {
    constructor() {
        super("polls", "0 */15 * * * *");   // every 15th minute
    }

    public async exec(): Promise<void> {
        try {
            // check whether the client is ready
            if (!this.client.isReady()) return;

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

                if (guild?.channels?.cache.has(giveawayDocument.channel)) {
                    // identify the channel for the giveaway
                    const channel = guild.channels.cache.get(giveawayDocument.channel) as GuildTextBasedChannel;

                    // identify the giveaway message
                    const giveawayMessage = await channel.messages.fetch(giveawayDocument._id).catch(Logger.ignore);

                    if (giveawayMessage) {
                        // find giveaway winners
                        const winnerDetails = giveawayMessage.embeds[0].footer.text.match(/^(\d+) .+/i);
                        const winnerCount = parseInt(winnerDetails?.[1]) || 1;
                        let winners: User[] = [];

                        if (giveawayMessage.reactions.cache.has("🎉")) {
                            // identify giveaway participants
                            await giveawayMessage.reactions.cache.get("🎉").users.fetch().catch(Logger.ignore);

                            // get random participants
                            winners = giveawayMessage.reactions.cache.get("🎉").users.cache.filter(u => !u.bot).random(winnerCount);
                        }

                        // announce the result
                        await giveawayMessage.edit({
                            embeds: [
                                {
                                    color: winners.length ? COLORS.SECONDARY : COLORS.RED,
                                    author: {
                                        name: "GIVEAWAY ENDED",
                                    },
                                    title: giveawayMessage.embeds[0].title,
                                    description: (this.client as Client).locales.getText(guild.preferredLocale, winners.length ? "giveawayWinners" : "giveawayNoWinners"),
                                    fields: winners.length ? [
                                        {
                                            name: "Congratulations",
                                            value: winners.join(" "),
                                        },
                                    ] : [],
                                    footer: {
                                        text: winners.length ? `${ winnerCount } Winners` : "",
                                    },
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                            components: winners.length ? [
                                {
                                    type: ComponentType.ActionRow,
                                    components: [
                                        {
                                            type: ComponentType.Button,
                                            label: "Reroll Giveaway",
                                            style: ButtonStyle.Secondary,
                                            customId: MessageComponents.GiveawayEndButton,
                                        },
                                    ],
                                },
                            ] : [],
                        }).then(() => {
                            // mark this giveaway as complete
                            completed.push(giveawayMessage.id);
                        }).catch(Logger.error);
                    } else {
                        // mark this giveaway as complete
                        completed.push(giveawayDocument.id);
                    }
                }
            }

            // remove the completed giveaways
            if (completed.length) {
                await GiveawayModel.deleteMany({
                    $or: completed.map(id => ({ _id: id })),
                }).catch(Logger.error);
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}

export { GiveawayScheduler as Scheduler };
