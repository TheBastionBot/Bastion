/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ButtonStyle, ChatInputCommandInteraction, ComponentType, Guild, GuildMember, InteractionEditReplyOptions, MessageFlags, Snowflake, User } from "discord.js";
import { Client } from "@bastion/tesseract";

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
 * Builds a premium gate response.
 * @param interaction The interaction that hit the gate.
 * @param titleKey The locale key for the heading.
 * @param key The locale key describing the limit or feature.
 * @param tier The tier the server is currently on.
 * @param variables Variables to resolve in the specified locale string.
 * @returns The response payload.
 */
const buildUpsell = (interaction: ChatInputCommandInteraction<"cached">, titleKey: string, key: string, tier: Tier, variables?: Record<string, number>): InteractionEditReplyOptions => {
    const locales = (interaction.client as Client).locales;
    const text = (k: string, v?: Record<string, string | number>): string => locales.getText(interaction.guildLocale, k, v);

    const isOwner = interaction.user.id === interaction.guild.ownerId;

    return {
        flags: MessageFlags.IsComponentsV2,
        components: [
            {
                type: ComponentType.TextDisplay,
                content: "### " + text(titleKey),
            },
            {
                type: ComponentType.TextDisplay,
                content: text(key, variables),
            },
            {
                type: ComponentType.TextDisplay,
                content: "-# " + text("premiumSelfHostHint"),
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        label: text(tier === Tier.Free ? "premiumButton" : "premiumButtonUpgrade"),
                        style: ButtonStyle.Link,
                        url: locales.getConstant("bastion.premium"),
                    },
                ],
            },
            ...isOwner ? [ {
                type: ComponentType.TextDisplay,
                content: "-# " + text("premiumPatronHint"),
            } ] : [],
        ],
    };
};

/**
 * Builds the response for a gate where the server has used up an allowance.
 * @param interaction The interaction that hit the gate.
 * @param key The locale key describing the limit.
 * @param limit The allowance the server has used up, resolved into `%limit%`.
 * @param tier The tier the server is currently on.
 * @returns The response payload.
 */
export const premiumLimitUpsell = (interaction: ChatInputCommandInteraction<"cached">, key: string, limit: number, tier: Tier): InteractionEditReplyOptions =>
    buildUpsell(interaction, "premiumTitleLimit", key, tier, { limit });

/**
 * Builds the response for a gate where the feature is unavailable on the
 * server's tier at all.
 * @param interaction The interaction that hit the gate.
 * @param key The locale key describing the feature.
 * @param tier The tier the server is currently on. Defaults to `Tier.Free`,
 * since the boolean gates only fire when `isPremiumUser` is false.
 * @returns The response payload.
 */
export const premiumFeatureUpsell = (interaction: ChatInputCommandInteraction<"cached">, key: string, tier: Tier = Tier.Free): InteractionEditReplyOptions =>
    buildUpsell(interaction, "premiumTitleFeature", key, tier);

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

    return Tier.Free;
};

/**
 * Check if the specified user has a premium membership.
 * @param identifier User who is to be checked for premium membership.
 * @returns Whether the user is a premium user.
 */
export const isPremiumUser = async (identifier: Snowflake | User | GuildMember | Guild): Promise<boolean> => await getPremiumTier(identifier) !== Tier.Free;
