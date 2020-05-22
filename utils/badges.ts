/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Snowflake } from "tesseract";
import { GuildMember } from "discord.js";
import { Response } from "node-fetch";

import * as constants from "./constants";
import * as omnic from "./omnic";
import * as BADGES from "../assets/badges.json";

export interface Badge {
    name?: string;
    icon?: string;
    emoji?: string;
    value?: number;
}

export const resolveBadges = (value: number): Badge[] => {
    const badges = [];
    for (let index = 0; index < Object.keys(BADGES).length; index++) {
        const badgeValue = 1 << index;
        if ((value & badgeValue) === badgeValue) badges.push(BADGES[Object.keys(BADGES)[index] as keyof typeof BADGES]);
    }
    return badges;
};

type FetchBadgesFunction = {
    (userId: Snowflake): Promise<Response>;
    (ownerId: Snowflake, guildId: Snowflake): Promise<Response>;
}
export const fetchBadges: FetchBadgesFunction = (userId: Snowflake, guildId?: Snowflake): Promise<Response> => {
    return omnic.makeRequest("/badges/user/" + userId + (guildId ? "/" + guildId : ""));
};

export const getMemberBadgeValue = (member: GuildMember): number => {
    let badgeValue = 0;

    // Guild Owner
    if (member.guild.ownerID === member.id) badgeValue |= constants.BADGES.GUILD_OWNER;
    // Guild Staff
    if (member.permissions.has("MANAGE_GUILD") || member.permissions.has("MANAGE_ROLES") || member.permissions.has("MANAGE_CHANNELS") || member.permissions.has("MANAGE_MESSAGES") || member.permissions.has("MANAGE_WEBHOOKS") || member.permissions.has("MANAGE_NICKNAMES") || member.permissions.has("MANAGE_EMOJIS")) badgeValue |= constants.BADGES.GUILD_STAFF;
    // 9Y Club
    if (Date.now() - member.joinedTimestamp >= 9 * 31556952e3) badgeValue |= constants.BADGES.GUILD_9Y_CLUB;
    // 8Y Club
    else if (Date.now() - member.joinedTimestamp >= 8 * 31556952e3) badgeValue |= constants.BADGES.GUILD_8Y_CLUB;
    // 7Y Club
    else if (Date.now() - member.joinedTimestamp >= 7 * 31556952e3) badgeValue |= constants.BADGES.GUILD_7Y_CLUB;
    // 6Y Club
    else if (Date.now() - member.joinedTimestamp >= 6 * 31556952e3) badgeValue |= constants.BADGES.GUILD_6Y_CLUB;
    // 5Y Club
    else if (Date.now() - member.joinedTimestamp >= 5 * 31556952e3) badgeValue |= constants.BADGES.GUILD_5Y_CLUB;
    // 4Y Club
    else if (Date.now() - member.joinedTimestamp >= 4 * 31556952e3) badgeValue |= constants.BADGES.GUILD_4Y_CLUB;
    // 3Y Club
    else if (Date.now() - member.joinedTimestamp >= 3 * 31556952e3) badgeValue |= constants.BADGES.GUILD_3Y_CLUB;
    // 2Y Club
    else if (Date.now() - member.joinedTimestamp >= 2 * 31556952e3) badgeValue |= constants.BADGES.GUILD_2Y_CLUB;
    // 1Y Club
    else if (Date.now() - member.joinedTimestamp >= 1 * 31556952e3) badgeValue |= constants.BADGES.GUILD_1Y_CLUB;
    // New Member (joined in the last 42 days)
    else if (Date.now() - member.joinedTimestamp <= 36288e5) badgeValue |= constants.BADGES.GUILD_NEW_MEMBER;

    return badgeValue;
};

export const has = (badges: number, badge: string | number): boolean => {
    if (typeof badge === "string") {
        return (badges & constants.BADGES[badge as keyof typeof constants.BADGES]) === constants.BADGES[badge as keyof typeof constants.BADGES];
    }
    return (badges & badge) === badge;
};

export const getMembership = (badges: number): Badge & { color: number } => {
    if (has(badges, "BASTION_DIAMOND_USER")) {
        return {
            ...BADGES["BASTION_DIAMOND_USER"],
            color: constants.COLORS.DIAMOND,
        };
    }
    if (has(badges, "BASTION_DIAMOND_GUILD")) {
        return {
            ...BADGES["BASTION_DIAMOND_GUILD"],
            color: constants.COLORS.DIAMOND,
        };
    }
    if (has(badges, "BASTION_PLATINUM_USER")) {
        return {
            ...BADGES["BASTION_PLATINUM_USER"],
            color: constants.COLORS.PLATINUM,
        };
    }
    if (has(badges, "BASTION_PLATINUM_USER")) {
        return {
            ...BADGES["BASTION_PLATINUM_USER"],
            color: constants.COLORS.PLATINUM,
        };
    }
    if (has(badges, "BASTION_GOLD_USER")) {
        return {
            ...BADGES["BASTION_GOLD_USER"],
            color: constants.COLORS.GOLD,
        };
    }
    if (has(badges, "BASTION_GOLD_USER")) {
        return {
            ...BADGES["BASTION_GOLD_USER"],
            color: constants.COLORS.GOLD,
        };
    }
};
