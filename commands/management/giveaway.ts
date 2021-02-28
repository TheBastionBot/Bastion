/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, User } from "discord.js";

import GiveawayModel from "../../models/Giveaway";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");

export = class GiveawayCommand extends Command {
    /** The default reactions for participating. */
    private reactions: string[];
    /** The default timeout of the giveaway, in hours. */
    private defaultTimeout: number;
    /** The default number of winners for the giveaway. */
    private defaultWinners: number;

    constructor() {
        super("giveaway", {
            description: "It allows you to run giveaway events in the server for at least an hour and at most a month. You can set any number of winners for the event. And it also allows you to reroll the winners, if need be, after the end of the event.",
            triggers: [],
            arguments: {
                alias: {
                    reroll: [ "r" ],
                    timeout: [ "t" ],
                    winners: [ "w" ],
                },
                number: [ "timeout", "winners" ],
                coerce: {
                    timeout: (arg): number => typeof arg === "number" && numbers.clamp(arg, 1, 720),
                    winners: (arg): number => typeof arg === "number" && Math.floor(numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER)),
                },
                default: {
                    timeout: 3,
                    winners: 1,
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_CHANNELS" ],
            syntax: [
                "giveaway -- ITEM",
                "giveaway --winners NUMBER -- ITEM",
                "giveaway --timeout HOURS -- ITEM",
                "giveaway --reroll ID --winners NUMBER",
            ],
        });

        this.reactions = [ "🎊", "🎉" ];
        this.defaultTimeout = 3;
        this.defaultWinners = 1;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (argv.reroll) {
            // identify the giveaway message
            const giveawayMessage = await message.channel.messages.fetch(argv.reroll);

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

            for (let i = 0; i < (argv.winners || 1); i++) {
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
                            name: "GIVEAWAY WINNERS REROLLED",
                        },
                        title: giveawayMessage.embeds[0].title,
                        description: "The giveaway winners were rerolled and the following users have won the giveaway and will be contacted soon for their rewards.\nThank you everyone for participating. Better luck next time.",
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
                });
            }
        }


        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const item = argv._.join(" ");
        const timeout = argv.timeout ? argv.timeout : this.defaultTimeout;
        const winners = argv.winners ? argv.winners : this.defaultWinners;


        // check for premium membership
        if (constants.isPublicBastion(this.client.user)) {
            // fetch the premium tier
            const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                // this error can be ignored
            });


            if (tier) { // check for premium membership limits
                if (tier === omnic.PremiumTier.GOLD && timeout > constants.LIMITS.GOLD.GIVEAWAY_TIMEOUT) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitGiveawayTimeout", constants.LIMITS.GOLD.GIVEAWAY_TIMEOUT));
                } else if (tier === omnic.PremiumTier.PLATINUM && timeout > constants.LIMITS.PLATINUM.GIVEAWAY_TIMEOUT) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitGiveawayTimeout", constants.LIMITS.PLATINUM.GIVEAWAY_TIMEOUT));
                }
            } else if (timeout > constants.LIMITS.GIVEAWAY_TIMEOUT) {
                throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumGiveawayTimeout", constants.LIMITS.GIVEAWAY_TIMEOUT));
            }


            // find active giveaways in the server
            const activeGiveawaysCount = await GiveawayModel.countDocuments({
                guild: message.guild.id,
                ends: {
                    $gte: new Date(),
                },
            });


            if (tier) { // check for premium membership limits
                if (tier === omnic.PremiumTier.GOLD && activeGiveawaysCount >= constants.LIMITS.GOLD.GIVEAWAYS) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitGiveaways", constants.LIMITS.GOLD.GIVEAWAYS));
                } else if (tier === omnic.PremiumTier.PLATINUM && activeGiveawaysCount >= constants.LIMITS.PLATINUM.GIVEAWAYS) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitGiveaways", constants.LIMITS.PLATINUM.GIVEAWAYS));
                }
            } else if (activeGiveawaysCount >= constants.LIMITS.GIVEAWAYS) {    // no premium membership
                throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumGiveaways", constants.LIMITS.GIVEAWAYS));
            }
        }


        // calculate end date
        const expectedEndDate = new Date(Date.now() + timeout * 36e5);

        // acknowledge
        const giveawayMessage = await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "GIVEAWAY!",
                },
                title: item,
                description: "React to this message with " + this.reactions.join(" or ") + " to participate in the giveaway for a chance to win.",
                footer: {
                    text: winners + " Winners • Ends"
                },
                timestamp: expectedEndDate,
            },
        });

        // create the giveaway
        await GiveawayModel.create({
            _id: giveawayMessage.id,
            channel: giveawayMessage.channel.id,
            guild: giveawayMessage.guild.id,
            winners: winners,
            ends: expectedEndDate,
        });

        // add giveaway reactions
        for (const reaction of this.reactions) {
            await giveawayMessage.react(reaction).catch(() => {
                // this error can be ignored
            });
        }
    }
}
