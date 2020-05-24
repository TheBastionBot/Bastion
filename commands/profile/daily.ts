/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import * as numbers from "../../utils/numbers";
import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class DailyCommand extends Command {
    constructor() {
        super("daily", {
            description: "It allows you to claim Bastion Coins, that every member receives as a reward for being in the server. You can claim your rewards once every 24 hours.",
            triggers: [ "claim" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    getClaimMessageKey = (streak: number): string => {
        switch (streak) {
        case 1: return "claimStreakFirst";
        case 6: return "claimStreakLast";
        case 7: return "claimStreakClaimed";
        default: return "claimStreak";
        }
    }

    exec = async (message: Message): Promise<void> => {
        const member = message.member as BastionGuildMember;

        const today = new Date();
        const yesterday = ((d): Date => new Date(d.setDate(d.getDate() - 1)))(new Date());
        const lastClaimed = new Date(member.document.lastClaimed);

        // check whether already claimed today
        if (today.toDateString() === lastClaimed.toDateString()) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "alreadyClaimed", message.author.tag));
        // otherwise, update last claim date to today
        member.document.lastClaimed = today.getTime();

        // generate the base reward
        let rewardAmount = numbers.getRandomInt(42, 128);

        // reduce the reward into half if the user has been a member for less than 3 days
        if (today.getTime() - message.member.joinedTimestamp < 2592e5) {
            rewardAmount /= 2;
        }

        // increment claim streak, if they didn't miss their timeframe
        member.document.claimStreak = yesterday.toDateString() === lastClaimed.toDateString() ? member.document.claimStreak + 1 : 1;

        // get claim message for the current streak
        const claimStreakMessage = this.client.locale.getString((message.guild as BastionGuild).document.language, "info", this.getClaimMessageKey(member.document.claimStreak), 7 - member.document.claimStreak);

        // check whether member has completed the streak
        if (member.document.claimStreak === 7) {
            // reset claim streak
            member.document.claimStreak = 0;
            // bonus reward
            rewardAmount += numbers.getRandomInt(512, 1024);
        }

        // double the reward for server boosters
        if (message.member.premiumSinceTimestamp) {
            rewardAmount *= 2;
        }

        // update member's balance
        member.document.balance += rewardAmount;

        // save document
        await member.document.save();

        // acknowledge
        message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "claim", message.author.tag) + "\n\n" + claimStreakMessage,
                footer: {
                    text: message.member.premiumSinceTimestamp ? this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "claimRewardBooster") : "",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
