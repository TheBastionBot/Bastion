/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Guild, GuildMember, Snowflake, User } from "discord.js";

import { fetchPatronByDiscordId } from "./patreon.js";
import { patreon } from "../types.js";

export enum Tier {
    Free = "Free",
    Gold = "Gold",
    Platinum = "Platinum",
    Diamond = "Diamond",
}

export enum Feature {
    Music = "Music",
    VoiceSessions = "VoiceSessions",
    GamificationMultiplier = "GamificationMultiplier",
    GamblingRewardMultiplier = "GamblingRewardMultiplier",
    VotingChannels = "VotingChannels",
    StreamersPerService = "StreamersPerService",
    TimedGiveaways = "TimedGiveaways",
    GiveawayTimeout = "GiveawayTimeout",
    TimedPolls = "TimedPolls",
    PollTimeout = "PollTimeout",
    RoleLevels = "RoleLevels",
    RolesPerLevel = "RolesPerLevel",
    SelectRoles = "SelectRoles",
    AutoRoles = "AutoRoles",
    SelfRoles = "SelfRoles",
    Triggers = "Triggers",
}

const Limits = {
    [Tier.Free]: {
        [Feature.Music]: false,
        [Feature.VoiceSessions]: false,
        [Feature.GamificationMultiplier]: false,
        [Feature.GamblingRewardMultiplier]: false,
        [Feature.VotingChannels]: 1,
        [Feature.StreamersPerService]: 3,
        [Feature.TimedGiveaways]: 0,
        [Feature.GiveawayTimeout]: 0,
        [Feature.TimedPolls]: 0,
        [Feature.PollTimeout]: 0,
        [Feature.RoleLevels]: 5,
        [Feature.RolesPerLevel]: 1,
        [Feature.SelectRoles]: 2,
        [Feature.AutoRoles]: 5,
        [Feature.SelfRoles]: 5,
        [Feature.Triggers]: 5,
    },

    [Tier.Gold]: {
        [Feature.Music]: true,
        [Feature.VoiceSessions]: true,
        [Feature.GamificationMultiplier]: true,
        [Feature.GamblingRewardMultiplier]: true,
        [Feature.VotingChannels]: 5,
        [Feature.StreamersPerService]: 5,
        [Feature.TimedGiveaways]: 10,
        [Feature.GiveawayTimeout]: 168,
        [Feature.TimedPolls]: 10,
        [Feature.PollTimeout]: 168,
        [Feature.RoleLevels]: 10,
        [Feature.RolesPerLevel]: 3,
        [Feature.SelectRoles]: 5,
        [Feature.AutoRoles]: 10,
        [Feature.SelfRoles]: 10,
        [Feature.Triggers]: 10,
    },

    [Tier.Platinum]: {
        [Feature.Music]: true,
        [Feature.VoiceSessions]: true,
        [Feature.GamificationMultiplier]: true,
        [Feature.GamblingRewardMultiplier]: true,
        [Feature.VotingChannels]: 10,
        [Feature.StreamersPerService]: 10,
        [Feature.TimedGiveaways]: 20,
        [Feature.GiveawayTimeout]: 360,
        [Feature.TimedPolls]: 20,
        [Feature.PollTimeout]: 360,
        [Feature.RoleLevels]: 20,
        [Feature.RolesPerLevel]: 5,
        [Feature.SelectRoles]: 10,
        [Feature.AutoRoles]: 20,
        [Feature.SelfRoles]: 20,
        [Feature.Triggers]: 20,
    },

    [Tier.Diamond]: {
        [Feature.Music]: true,
        [Feature.VoiceSessions]: true,
        [Feature.GamificationMultiplier]: true,
        [Feature.GamblingRewardMultiplier]: true,
        [Feature.VotingChannels]: Infinity,
        [Feature.StreamersPerService]: Infinity,
        [Feature.TimedGiveaways]: Infinity,
        [Feature.GiveawayTimeout]: Infinity,
        [Feature.TimedPolls]: Infinity,
        [Feature.PollTimeout]: Infinity,
        [Feature.RoleLevels]: Infinity,
        [Feature.RolesPerLevel]: Infinity,
        [Feature.SelectRoles]: Infinity,
        [Feature.AutoRoles]: Infinity,
        [Feature.SelfRoles]: Infinity,
        [Feature.Triggers]: Infinity,
    },
};

export const checkFeature = (tier: Tier, feature: Feature) => {
    const limit = Limits[tier]?.[feature];
    if (typeof limit === "undefined") return Limits[Tier.Free][feature];
    return limit;
};

/**
 * Returns the premium membership tier of the specified user.
 * @param identifier User who is to be checked for premium membership.
 * @returns The premium tier of the user.
 */
export const getPremiumTier = async (identifier: Snowflake | User | GuildMember | Guild): Promise<Tier> => {
    const userId = (identifier instanceof User || identifier instanceof GuildMember) ? identifier.id : identifier instanceof Guild ? identifier.ownerId : identifier;

    if (userId) {
        // check if it's me
        if (userId === "266290969974931457") return Tier.Diamond;

        // check whether it's a patron
        const owner: patreon.Patron = await fetchPatronByDiscordId(userId);

        // return premium membership tier
        if (owner?.patron_status === "active_patron") {
            if (owner.currently_entitled_amount_cents >= 1000) return Tier.Diamond;
            if (owner.currently_entitled_amount_cents >= 500) return Tier.Platinum;
            if (owner.currently_entitled_amount_cents >= 300) return Tier.Gold;
        }
    }

    return null;
};

/**
 * Check if the specified user has a premium membership.
 * @param identifier User who is to be checked for premium membership.
 * @returns Whether the user is a premium user.
 */
export const isPremiumUser = async (identifier: Snowflake | User | GuildMember | Guild): Promise<boolean> => !!await getPremiumTier(identifier);
