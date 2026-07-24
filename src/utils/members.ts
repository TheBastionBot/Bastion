/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildMember, GuildTextBasedChannel, Message, PartialGuildMember, PresenceStatus } from "discord.js";
import { Document } from "mongoose";
import { Client, Logger } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild.js";
import MemberModel, { Member as MemberDocument } from "../models/Member.js";
import RoleModel from "../models/Role.js";
import * as numbers from "./numbers.js";

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
export const updateBalance = (memberDocument: MemberDocument & Document, amount: number) => {
    // update member's balance
    if (memberDocument) {
        memberDocument.balance = numbers.clamp(memberDocument.balance + amount, 0, Number.MAX_SAFE_INTEGER);
        return memberDocument;
    }
};

/**
 * Update experience of a member's account.
 * @param memberDocument The member whose account experience is to be updated.
 * @param amount The amount which is to be added (or removed).
 * Use a negative value to remove the amount.
 */
export const updateExperience = (memberDocument: MemberDocument & Document, amount: number) => {
    // update member's experience
    if (memberDocument) {
        memberDocument.experience = numbers.clamp(memberDocument.experience + amount, 0, Number.MAX_SAFE_INTEGER);
        return memberDocument;
    }
};

/**
 * Assign level-up roles to a member for the specified level.
 * Swaps out roles configured for other levels and applies the roles
 * configured for the nearest level at or below the member's level.
 * @param member The guild member to update.
 * @param level The member's current level.
 */
export const assignLevelRoles = async (member: GuildMember, level: number): Promise<void> => {
    const roles = await RoleModel.find({
        guild: member.guild.id,
        level: { $exists: true, $ne: null },
    });

    // check whether there are any level up roles
    if (!roles?.length) return;

    // get the nearest level for which roles are available
    const nearestLevel = numbers.smallestNeighbor(level, roles.map(r => r.level));

    // identify valid roles
    const levelRoles = roles.filter(r => r.level === nearestLevel && member.guild.roles.cache.has(r._id));
    const extraRoles = roles.filter(r => r.level !== nearestLevel && member.guild.roles.cache.has(r._id));

    // update member roles
    if (levelRoles.length) {
        const memberRoles = member.roles.cache
            .filter(r => !extraRoles.some(doc => doc.id === r.id))  // remove roles from any other level
            .map(r => r.id)
            .concat(levelRoles.map(doc => doc.id)); // add roles in the current level

        // update member roles
        member.roles.set([ ...new Set(memberRoles) ]).catch(Logger.error);
    }
};

/**
 * Side effects of a member leveling up.
 * Assign level roles and announce the level up.
 * @param member The guild member who leveled up.
 * @param guildDocument The guild's settings document.
 * @param level The member's new level.
 * @param fallback An optional message to reply to when no gamification
 * channel is configured.
 */
export const handleLevelUp = (member: GuildMember, guildDocument: GuildDocument, level: number, fallback?: Message): void => {
    // reward level roles, if available
    assignLevelRoles(member, level).catch(Logger.error);

    // check whether level up messages are enabled
    if (!guildDocument.gamificationMessages) return;

    const message = (member.client as Client).locales.getText(member.guild.preferredLocale, "leveledUp", { level: `Level ${ level }` });

    // announce the achievement
    if (guildDocument.gamificationChannel && member.guild.channels.cache.has(guildDocument.gamificationChannel)) {
        (member.guild.channels.cache.get(guildDocument.gamificationChannel) as GuildTextBasedChannel)
            .send(`${ member.user }, ${ message }`)
            .catch(Logger.ignore);
    } else if (fallback) {
        fallback.reply(message).catch(Logger.ignore);
    }
};
