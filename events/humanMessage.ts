/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, ModuleManagerEvent, Client } from "tesseract";
import { Message } from "discord.js";

import * as emojis from "../utils/emojis";
import * as numbers from "../utils/numbers";
import * as gamification from "../utils/gamification";

import TriggerModel from "../models/Trigger";

import BastionGuild = require("../structures/Guild");
import BastionGuildMember = require("../structures/GuildMember");

export = class HumanMessageEvent extends ModuleManagerEvent {
    constructor() {
        super("humanMessage");
    }

    handleGamification = async (message: Message): Promise<void> => {
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

        // level up
        if (computedLevel > member.document.level) {
            member.document.level = computedLevel;
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
        }

        // save document
        await member.document.save();
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
    }
}
