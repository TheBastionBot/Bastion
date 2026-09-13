/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import MemberModel from "../models/Member.js";
import * as numbers from "../utils/numbers.js";
import { withSubtext } from "../utils/strings.js";

const STREAK_LENGTH = 7;
const NEW_MEMBER_DAYS = STREAK_LENGTH;

/** Tells the member where they are in their claim streak. */
const streakNote = (claimStreak: number, previousStreak: number, continued: boolean): [ string, Record<string, string | number>? ] => {
    if (!continued) {
        // a single claim days ago isn't a streak worth mourning
        return previousStreak > 1 ? [ "rewardsStreakBroken", { days: previousStreak } ] : [ "rewardsStreakNone" ];
    }

    // where they are in the current bonus week
    const day = (claimStreak - 1) % STREAK_LENGTH + 1;

    if (day <= 2) return [ "rewardsStreakBegun" ];
    if (day === STREAK_LENGTH - 1) return [ "rewardsStreakLastDay" ];
    if (day === STREAK_LENGTH) return [ "rewardsStreakComplete", { days: claimStreak } ];
    return [ "rewardsStreakProgress", { days: STREAK_LENGTH - day } ];
};

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

        const text = (key: string, variables?: Record<string, string | number>): string => (interaction.client as Client).locales.getText(interaction.guildLocale, key, variables);

        // get the member document
        const memberDocument = await MemberModel.findOne({
            user: interaction.user.id,
            guild: interaction.guild.id,
        });

        // check whether user profile exists
        if (!memberDocument) {
            return interaction.editReply({
                content: text("profileNotCreated", { user: interaction.user.toString() }),
                allowedMentions: {
                    users: [],
                },
            });
        }

        const today = new Date();
        const yesterday = ((d): Date => new Date(d.setDate(d.getDate() - 1)))(new Date());
        const lastClaimed = new Date(memberDocument.lastClaimed);
        const isNewMember = today.getTime() - interaction.member.joinedTimestamp < NEW_MEMBER_DAYS * 864e5;
        const newMemberNote = isNewMember ? text("rewardsClaimNewMember", { days: NEW_MEMBER_DAYS }) : undefined;

        // rewards reset at midnight
        const nextClaim = Math.floor(new Date(today).setHours(24, 0, 0, 0) / 1000);
        const alreadyClaimed = withSubtext(text("rewardsClaimAlready"), newMemberNote || text("rewardsClaimNext", { timestamp: `<t:${ nextClaim }:R>` }));

        // check whether already claimed today
        if (today.toDateString() === lastClaimed.toDateString()) return interaction.editReply(alreadyClaimed);

        // generate the base reward
        let rewardAmount = numbers.getRandomInt(42, 128);

        // reduce the reward into half for new members
        if (isNewMember) {
            rewardAmount = Math.round(rewardAmount / 2);
        }

        // increment claim streak, if they didn't miss their timeframe
        const continuedStreak = yesterday.toDateString() === lastClaimed.toDateString();
        const claimStreak = continuedStreak ? memberDocument.claimStreak + 1 : 1;

        // check whether member has completed another week of the streak
        if (claimStreak % STREAK_LENGTH === 0) {
            // bonus reward
            rewardAmount += numbers.getRandomInt(512, 1024);
        }

        // double the reward for server boosters
        if (interaction.member.premiumSinceTimestamp) {
            rewardAmount *= 2;
        }

        // credit the reward and update the streak
        const startOfToday = new Date(today).setHours(0, 0, 0, 0);
        const { modifiedCount } = await MemberModel.updateOne({
            user: interaction.user.id,
            guild: interaction.guild.id,
            // prevent concurrent claims from slipping through
            lastClaimed: { $not: { $gte: startOfToday } },
        }, {
            $inc: { balance: rewardAmount },
            $set: { lastClaimed: today.getTime(), claimStreak },
        });

        // a concurrent claim already collected today's reward
        if (!modifiedCount) return interaction.editReply(alreadyClaimed);

        // streak note
        const [ streakKey, streakVariables ] = streakNote(claimStreak, memberDocument.claimStreak, continuedStreak);
        const isStreakMoment = streakKey === "rewardsStreakComplete" || streakKey === "rewardsStreakBroken";

        // acknowledge
        await interaction.editReply(withSubtext(
            text("rewardsClaimed", { amount: rewardAmount }),
            newMemberNote && !isStreakMoment ? newMemberNote : text(streakKey, streakVariables),
        ));
    }
}

export { ClaimCommand as Command };
