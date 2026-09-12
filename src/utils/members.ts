/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Guild, GuildMember, GuildTextBasedChannel, Message, PartialGuildMember, PresenceStatus, UserResolvable } from "discord.js";
import { Client, Logger } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild.js";
import MemberModel from "../models/Member.js";
import RoleModel from "../models/Role.js";
import * as numbers from "./numbers.js";

/**
 * Resolves the specified user to a guild member, from the cache when available.
 * @param guild The guild of the member.
 * @param user The user you want to resolve.
 */
export const resolveMember = (guild: Guild, user: UserResolvable): Promise<GuildMember | null> => guild.members.fetch(user).catch(() => null);

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

    // record the infraction in a single atomic upsert, so concurrent warnings
    // can't both miss an existing document and collide on the unique index
    const memberDocument = await MemberModel.findOneAndUpdate(
        { user: member.id, guild: member.guild.id },
        { $push: { infractions: reason } },
        { returnDocument: "after", upsert: true },
    );

    const infractionCount = memberDocument.infractions.length;

    if (infractionCount === guildDocument?.infractionsTimeoutThreshold) {
        await member.timeout(9e5, infractionCount + " infractions");
    }

    if (infractionCount === guildDocument?.infractionsKickThreshold && member.kickable) {
        await member.kick(infractionCount + " infractions");
    }

    if (infractionCount === guildDocument?.infractionsBanThreshold && member.bannable) {
        await member.ban({
            reason: infractionCount + " infractions",
        });

        // clear all infractions once member is banned
        await clearInfraction(member);
    }
};

/**
 * Clear all of a member's infractions.
 * @param member The member.
 */
export const clearInfraction = async (member: PartialGuildMember | GuildMember) => {
    // clear the infractions in a single write, instead of reading the document
    // first and saving it back
    await MemberModel.updateOne({ user: member.id, guild: member.guild.id }, {
        $unset: { infractions: 1 },
    });
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
    }).lean();

    // check whether there are any level up roles
    if (!roles?.length) return;

    // get the nearest level for which roles are available
    const nearestLevel = numbers.smallestNeighbor(level, roles.map(r => r.level));

    // identify valid roles
    const levelRoles = roles.filter(r => r.level === nearestLevel && member.guild.roles.cache.has(r._id));
    const extraRoles = roles.filter(r => r.level !== nearestLevel && member.guild.roles.cache.has(r._id));

    // the roles the member should hold afterwards
    const memberRoles = new Set(member.roles.cache
        .filter(r => !extraRoles.some(doc => doc._id === r.id))  // remove roles from any other level
        .map(r => r.id));
    for (const doc of levelRoles) memberRoles.add(doc._id); // add roles in the current level

    // update member roles
    if (memberRoles.size !== member.roles.cache.size || member.roles.cache.some(r => !memberRoles.has(r.id))) {
        member.roles.set([ ...memberRoles ]).catch(Logger.error);
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
