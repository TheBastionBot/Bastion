/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import MemberModel from "../models/Member.js";
import * as numbers from "../utils/numbers.js";
import * as members from "../utils/members.js";

class ClaimCommand extends Command {
    constructor() {
        super({
            name: "claim",
            description: "Claim any rewards available to you.",
            scope: "guild",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();

        // get the member document
        const memberDocument = await MemberModel.findOne({
            user: interaction.user.id,
            guild: interaction.guild.id,
        });

        // check whether user profile exists
        if (!memberDocument) {
            return interaction.editReply({
                content: (interaction.client as Client).locales.getText(interaction.guildLocale, "profileNotCreated", { user: interaction.user }),
                allowedMentions: {
                    users: [],
                },
            });
        }

        const today = new Date();
        const yesterday = ((d): Date => new Date(d.setDate(d.getDate() - 1)))(new Date());
        const lastClaimed = new Date(memberDocument.lastClaimed);

        // check whether already claimed today
        if (today.toDateString() === lastClaimed.toDateString()) return interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "rewardsAlreadyClaimed"));
        // otherwise, update last claim date to today
        memberDocument.lastClaimed = today.getTime();

        // generate the base reward
        let rewardAmount = numbers.getRandomInt(42, 128);

        // reduce the reward into half if the user has been a member for less than 3 days
        if (today.getTime() - interaction.member.joinedTimestamp < 2592e5) {
            rewardAmount /= 2;
        }

        // increment claim streak, if they didn't miss their timeframe
        memberDocument.claimStreak = yesterday.toDateString() === lastClaimed.toDateString() ? memberDocument.claimStreak + 1 : 1;

        // check whether member has completed the streak
        if (memberDocument.claimStreak === 7) {
            // reset claim streak
            memberDocument.claimStreak = 0;
            // bonus reward
            rewardAmount += numbers.getRandomInt(512, 1024);
        }

        // double the reward for server boosters
        if (interaction.member.premiumSinceTimestamp) {
            rewardAmount *= 2;
        }

        // credit reward amount into member's account
        members.updateBalance(memberDocument, rewardAmount);

        // save document
        await memberDocument.save();

        // acknowledge
        await interaction.editReply((interaction.client as Client).locales.getText(interaction.guildLocale, "rewardsClaimed", { amount: rewardAmount }));
    }
}

export { ClaimCommand as Command };
