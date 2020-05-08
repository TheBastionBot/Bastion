/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, ModuleManagerEvent, Client, Logger } from "tesseract";
import { Message, Snowflake } from "discord.js";

import * as emojis from "../utils/emojis";
import * as numbers from "../utils/numbers";
import * as gamification from "../utils/gamification";

import RoleModel from "../models/Role";
import TextChannelModel from "../models/TextChannel";
import TriggerModel from "../models/Trigger";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");
import TesseractClient from "tesseract/typings/client/TesseractClient";

export = class HumanMessageEvent extends ModuleManagerEvent {
    private recentUsers: Map<Snowflake, string[]>;

    constructor() {
        super("humanMessage");

        this.recentUsers = new Map<Snowflake, string[]>();
    }

    handleLevelRoles = async (message: Message, level: number): Promise<void> => {
        const roles = await RoleModel.find({
            guild: message.guild.id,
            level: { $exists: true },
        });

        // identify valid roles
        const extraRoles = roles.filter(r => r.level !== level && message.guild.roles.cache.has(r._id))
        const levelRoles = roles.filter(r => r.level === level && message.guild.roles.cache.has(r._id));

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
        member.document.experience += 1;

        // compute current level from new experience
        const computedLevel: number = gamification.computeLevel(member.document.experience, guild.document.gamification.multiplier);

        // update level
        member.document.level = computedLevel;

        // level up
        if (computedLevel > member.document.level) {
            member.document.balance = numbers.clamp(member.document.balance + computedLevel * gamification.DEFAUL_CURRENCY_REWARD_MULTIPLIER, Number.MAX_SAFE_INTEGER);

            // achievement message
            if (guild.document.gamification.messages) {
                message.channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        fields: [
                            {
                                name: "LEVELED UP!",
                                value: bastion.locale.getString(guild.document.language, "info", "levelUp", message.author.tag, member.document.level),
                            },
                        ],
                    },
                }).catch(() => {
                    // this error can be ignored
                });
            }

            // reward level roles, if available
            this.handleLevelRoles(message, member.document.level)
                .catch(Logger.error);
        }

        // save document
        await member.document.save();

        // add to recent users
        recentUsers.push(message.author.id);
        this.recentUsers.set(message.guild.id, recentUsers);

        // remove the user after cooldown period
        (message.client as TesseractClient).setTimeout(() => {
            const recentUsers = this.recentUsers.get(message.guild.id);
            recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
            this.recentUsers.set(message.guild.id, recentUsers);
        }, 13e3);
    }

    handleTriggers = async (message: Message): Promise<void> => {
        if (!message.content) return;

        const triggers = await TriggerModel.find({ guild: message.guild.id });

        // TODO: if multiple responses are there for a single trigger, randomize it
        for (const trigger of triggers) {
            const patternRegExp = new RegExp(trigger.trigger.replace(/\?/g, ".").replace(/\*+/g, ".*"), "ig");

            if (!patternRegExp.test(message.content)) continue;

            if (trigger.responseMessage) {
                message.channel.send(trigger.responseMessage);
            }

            if (trigger.responseReaction) {
                const emoji = emojis.parseEmoji(trigger.responseReaction);

                if (emoji) {
                    message.react(emoji.reaction);
                }
            }
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

    exec = async (message: Message): Promise<void> => {
        if (!message.guild) return;

        // handle member gamification
        this.handleGamification(message).catch(() => {
            // this error can be ignored
        });

        // handle triggers
        this.handleTriggers(message).catch(() => {
            // this error can be ignored
        });

        // handle voting channels
        this.handleVotingChannels(message).catch(() => {
            // this error can be ignored
        });
    }
}
