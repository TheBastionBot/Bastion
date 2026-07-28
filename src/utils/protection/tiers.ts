/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { Signal } from "./signals.js";

export type ProtectionAction = "none" | "alert" | "delete" | "purgeTimeout" | "purgeBan";

/** The score floors for tiers 1, 2 and 3. */
const BANDS = [ 2, 4, 7 ];
const RAID_MULTIPLIER = 1.5;
/** The lenient protection level, used when a guild has none configured. */
export const DEFAULT_LEVEL = 1;

// what each protection level does at each tier
const ACTIONS: Record<number, ProtectionAction[]> = {
    1: [ "alert", "delete", "purgeBan" ],
    2: [ "alert", "purgeTimeout", "purgeBan" ],
    3: [ "delete", "purgeBan", "purgeBan" ],
};

/**
 * Sum the weights of the signals that fired, dampening each one when the
 * member is established and scaling the total during a raid.
 * @param signals The signals that fired.
 * @param established Whether the member is established in the guild.
 * @param raiding Whether the guild is currently in raid mode.
 */
export const score = (signals: Signal[], established: boolean, raiding: boolean): number => {
    const total = signals.reduce((sum, signal) => sum + (established ? signal.weight * signal.dampener : signal.weight), 0);

    // applies only when two or more signals fired, so a lone signal can't be
    // promoted into a ban during a raid.
    return raiding && signals.length >= 2 ? total * RAID_MULTIPLIER : total;
};

/**
 * Resolve a score to a confidence tier, 0 meaning no action.
 * @param value The score.
 */
export const tier = (value: number): number => {
    if (value >= BANDS[2]) return 3;
    if (value >= BANDS[1]) return 2;
    if (value >= BANDS[0]) return 1;
    return 0;
};

/**
 * Resolve the action for a tier at the guild's protection level.
 * @param level The guild's protection level.
 * @param tier The confidence tier.
 */
export const action = (level: number, tier: number): ProtectionAction => {
    if (!tier) return "none";

    // defence against an out-of-range level, not where policy is decided
    return (ACTIONS[level] ?? ACTIONS[DEFAULT_LEVEL])[tier - 1];
};
