/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, ModuleManagerEvent, Client } from "tesseract";
import { Message } from "discord.js";

import * as numbers from "../utils/numbers";
import * as gamification from "../utils/gamification";

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

    exec = async (message: Message): Promise<void> => {
        if (!message.guild) return;

        // handle member gamification
        await this.handleGamification(message);
    }
}
