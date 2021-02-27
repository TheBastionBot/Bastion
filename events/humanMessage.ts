/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, ModuleManagerEvent, Client, Logger } from "@bastion/tesseract";
import { ClientApplication, DMChannel, Message, Snowflake, Team, User } from "discord.js";

import * as embeds from "../utils/embeds";
import * as emojis from "../utils/emojis";
import * as gamification from "../utils/gamification";
import * as numbers from "../utils/numbers";
import * as omnic from "../utils/omnic";
import * as variables from "../utils/variables";

import ConfigModel from "../models/Config";
import MemberModel from "../models/Member";
import RoleModel from "../models/Role";
import TextChannelModel from "../models/TextChannel";
import TriggerModel from "../models/Trigger";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");

export = class HumanMessageEvent extends ModuleManagerEvent {
    private recentUsers: Map<Snowflake, string[]>;

    constructor() {
        super("humanMessage");

        this.recentUsers = new Map<Snowflake, string[]>();
    }

    handleLevelRoles = async (message: Message, level: number): Promise<void> => {
        const roles = await RoleModel.find({
            guild: message.guild.id,
            level: { $exists: true, $ne: null },
        });

        // check whether there are any level up roles
        if (!roles || !roles.length) return;

        // get the nearest level for which roles are available
        const nearestLevel = numbers.smallestNeighbor(level, roles.map(r => r.level));

        // identify valid roles
        const extraRoles = roles.filter(r => r.level !== nearestLevel && message.guild.roles.cache.has(r._id));
        const levelRoles = roles.filter(r => r.level === nearestLevel && message.guild.roles.cache.has(r._id));

        // update member roles
        if (levelRoles.length) {
            // add roles in the current level
            await message.member.roles.add(levelRoles.map(r => r._id));
            // remove roles from any other level
            await message.member.roles.remove(extraRoles.map(r => r._id));
        }
    }

    handleGamification = async (message: Message): Promise<void> => {
        // get recent users
        const recentUsers = this.recentUsers.get(message.guild.id) || [];

        // check whether the member had recently gained XP
        if (recentUsers.includes(message.author.id)) return;

        const bastion = message.client as Client;
        const guild = message.guild as BastionGuild;
        const member = message.member as BastionGuildMember;

        // check whether gamification is enabled
        if (!guild.document.gamification || !guild.document.gamification.enabled) return;

        // check whether member has exceeded max level or experience
        if (member.document.level >= gamification.MAX_LEVEL || member.document.experience >= gamification.MAX_EXPERIENCE(guild.document.gamification.multiplier)) return;

        // increment experience
        member.document.experience = member.premiumSinceTimestamp ? member.document.experience + 2 : member.document.experience + 1;

        // compute current level from new experience
        const computedLevel: number = gamification.computeLevel(member.document.experience, guild.document.gamification.multiplier);

        // level up
        if (computedLevel > member.document.level) {
            // credit reward amount into member's account
            await member.credit(computedLevel * gamification.DEFAUL_CURRENCY_REWARD_MULTIPLIER, "Level-up Reward", member.document);

            // achievement message
            if (guild.document.gamification.messages) {
                message.channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        fields: [
                            {
                                name: "LEVELED UP!",
                                value: bastion.locale.getString(guild.document.language, "info", "levelUp", message.author.tag, computedLevel),
                            },
                        ],
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            // reward level roles, if available
            this.handleLevelRoles(message, computedLevel)
                .catch(Logger.error);
        }

        // update level
        member.document.level = computedLevel;

        // save document
        await member.document.save();

        // add to recent users
        recentUsers.push(message.author.id);
        this.recentUsers.set(message.guild.id, recentUsers);

        // remove the user after cooldown period
        (message.client as Client).setTimeout(() => {
            const recentUsers = this.recentUsers.get(message.guild.id);
            recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
            this.recentUsers.set(message.guild.id, recentUsers);
        }, 13e3);
    }

    handleTriggers = async (message: Message): Promise<void> => {
        if (!message.content) return;

        const triggers = await TriggerModel.find({ guild: message.guild.id });

        // responses
        const responseMessages: Record<string, unknown>[] = [];
        const responseReactions: string[] = [];

        for (const trigger of triggers) {
            const patternRegExp = new RegExp(trigger.trigger.replace(/\?/g, ".").replace(/\*+/g, ".*"), "ig");

            if (!patternRegExp.test(message.content)) continue;

            if (trigger.responseMessage) {
                responseMessages.push(trigger.responseMessage);
            }

            if (trigger.responseReaction) {
                const emoji = emojis.parseEmoji(trigger.responseReaction);

                if (emoji) {
                    responseReactions.push(emoji.reaction);
                }
            }
        }

        // response message
        if (responseMessages.length) {
            message.channel.send({
                embed: {
                    ...embeds.generateEmbed(JSON.parse(variables.replaceMessageVariables(JSON.stringify(responseMessages[Math.floor(Math.random() * responseMessages.length)]), message))),
                    footer: {
                        text: (message.client as Client).locale.getConstant("bastion.name") + " Trigger",
                    },
                },
            }).catch(Logger.error);
        }

        // response reaction
        if (responseReactions.length) {
            message.react(responseReactions[Math.floor(Math.random() * responseReactions.length)]).catch(Logger.error);
        }
    }

    handleVotingChannels = async (message: Message): Promise<void> => {
        const votingChannel = await TextChannelModel.findOne({
            _id: message.channel.id,
            voting: true,
        });

        // check whether it's a voting channel
        if (!votingChannel) return;

        // set the message up for voting
        message.react("👍").catch(() => {
            // this error can be ignored
        });
        message.react("👎").catch(() => {
            // this error can be ignored
        });
    }

    handleKarma = async (message: Message): Promise<void> => {
        if (!message.content) return;

        // check whether gamification is enabled
        if (!(message.guild as BastionGuild).document.gamification || !(message.guild as BastionGuild).document.gamification.enabled) return;

        if ((message.content.toLowerCase().includes("thanks") || message.content.toLowerCase().includes("thank you")) && message.mentions.users && message.mentions.users.size) {
            const users = Array.from(message.mentions.users.keys()).filter(id => id !== message.member.id);

            await MemberModel.updateMany({
                user: {
                    $in: users,
                },
                guild: message.guild.id,
            }, {
                $inc: {
                    karma: 1,
                },
            });

            // react to the message for confirmation
            message.react("👍🏻").catch(() => {
                // this error can be ignored
            });
        }
    }

    handleInstantResponses = async (message: Message): Promise<void> => {
        if (!message.content) return;

        // fetch an instant response
        const response = await omnic.makeRequest("/chat/instant?message=" + encodeURIComponent(message.content)).then(res => res.json());

        // check whether there's an instant response
        if (response.status !== "success") return;

        const replies = response.response.reply instanceof Array ? response.response.reply : [ response.response.reply ];

        // respond with the instant replies
        for (const reply of replies) {
            await message.channel.send(reply).catch(() => {
                // this error can be ignored
            });
        }
    };

    handleDirectMessageRelay = async (message: Message): Promise<void> => {
        const config = await ConfigModel.findById(message.client.user.id);

        if (config.relayDirectMessages && message.content) {
            // get the application owner
            const app: ClientApplication = await message.client.fetchApplication();
            const owner: User = app.owner instanceof Team ? app.owner.owner.user : app.owner;

            // check if the message author is same as the owner
            if (message.author.id === owner.id) return;

            const channel: DMChannel = await owner.createDM();

            // relay the message to the application owner
            await channel.send({
                embed: {
                    color: Constants.COLORS.IRIS,
                    author: {
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true,
                            size: 64,
                        }),
                    },
                    description: message.content,
                    footer: {
                        text: message.author.id,
                    },
                },
            });
        }
    }

    exec = async (message: Message): Promise<void> => {
        if (message.guild) {
            // handle member gamification
            this.handleGamification(message).catch(() => {
                // this error can be ignored
            });

            // handle triggers
            this.handleTriggers(message).catch(() => {
                // this error can be ignored
            });

            // handle karma
            this.handleKarma(message).catch(Logger.error);

            // handle voting channels
            this.handleVotingChannels(message).catch(() => {
                // this error can be ignored
            });
        } else {
            // handle instant responses
            this.handleInstantResponses(message).catch(() => {
                // this error can be ignored
            });

            // handle direct message relays
            this.handleDirectMessageRelay(message).catch(() => {
                // this error can be ignored
            });
        }
    }
}
