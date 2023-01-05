/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, PartialGuildMember, PresenceStatus } from "discord.js";
import { Document } from "mongoose";

import GuildModel from "../models/Guild";
import MemberModel, { Member as MemberDocument } from "../models/Member";
import * as numbers from "./numbers";

/**
 * Check whether a moderator can manage the specified member.
 * @param moderator The moderator.
 * @param member The member to manage.
 */
export const manageable = (moderator: GuildMember, member: GuildMember): boolean => {
    if (moderator.id === moderator.guild.ownerId) return true;
    if (member.id === member.guild.ownerId) return false;
    if (moderator.id === member.id) return false;
    return moderator.roles.highest.comparePositionTo(member.roles.highest) > 0;
};

/**
 * Add infraction to a member.
 * @param member The member you want to warn.
 * @param reason The infraction message.
 */
export const addInfraction = async (member: PartialGuildMember | GuildMember, reason: string) => {
    const guildDocument = await GuildModel.findById(member.guild.id);

    let memberDocument = await MemberModel.findOne({ user: member.id, guild: member.guild.id });

    // check whether member document exists
    if (memberDocument) {
        // add infraction to member
        memberDocument.infractions = memberDocument.infractions instanceof Array ? memberDocument.infractions.concat(reason) : [ reason ];
    } else {
        // create the member document
        memberDocument = await MemberModel.create({
            user: member.id,
            guild: guildDocument.id,
            infractions: [ reason ],
        });
    }

    if (memberDocument.infractions.length === guildDocument.infractionsTimeoutThreshold) {
        await member.timeout(9e5, memberDocument.infractions.length + " infractions");
    }

    if (memberDocument.infractions.length === guildDocument.infractionsKickThreshold && member.kickable) {
        await member.kick(memberDocument.infractions.length + " infractions");
    }

    if (memberDocument.infractions.length === guildDocument.infractionsBanThreshold && member.bannable) {
        await member.ban({
            reason: memberDocument.infractions.length + " infractions",
        });

        // clear all infractions once member is banned
        memberDocument.infractions = [];
    }

    // save member
    return memberDocument.save();
};

/**
 * Clear a member's infraction.
 * @param member The member.
 */
export const clearInfraction = async (member: PartialGuildMember | GuildMember) => {
    const memberDocument = await MemberModel.findOne({ user: member.id, guild: member.guild.id });

    // check whether infractions exist
    if (memberDocument?.infractions?.length) {
        // clear all infractions
        memberDocument.infractions = undefined;
        delete memberDocument.infractions;

        // save member
        return memberDocument.save();
    }
};

/**
 * Resolves the specified `PresenceStatus` to a human readable string.
 * @param status The status you want to resolve.
 */
export const resolveStatus = (status: PresenceStatus) => {
    switch (status) {
    case "online":
        return "Online";
    case "idle":
        return "Idle";
    case "dnd":
        return "Do Not Disturb";
    case "invisible":
        return "Invisible";
    case "offline":
        return "Offline";
    default:
        return status;
    }
};

/**
 * Update balance of a member's account.
 * @param memberDocument The member whose account balance is to be updated.
 * @param amount The amount which is to be credited (or debited).
 * Use a negative value to debit the amount.
 */
export const updateBalance = async (memberDocument: MemberDocument & Document, amount: number) => {
    // update member's balance
    if (memberDocument) {
        memberDocument.balance = numbers.clamp(memberDocument.balance + amount, Number.MAX_SAFE_INTEGER);
        return memberDocument;
    }
};
