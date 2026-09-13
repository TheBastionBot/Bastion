/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { Snowflake } from "discord.js";

import GuildModel from "../models/Guild.js";
import MemberModel from "../models/Member.js";

/**
 * Builds the pipeline expression that safely adds the specified amount
 * to a field.
 *
 * @param field The field being adjusted.
 * @param amount The amount to add. Use a negative value to take it away.
 */
export const clampedIncrement = (field: string, amount: number): Record<string, unknown> => ({
    $min: [ Number.MAX_SAFE_INTEGER, { $max: [ 0, { $add: [ { $ifNull: [ `$${ field }`, 0 ] }, amount ] } ] } ],
});

/**
 * Debit coins from a member's balance, all or nothing.
 *
 * The balance requirement lives in the query, so the check and the subtraction
 * are one operation that a competing call cannot interleave with. A member who
 * can't cover it, or who has no record at all, is left untouched.
 * @param user The member's user ID.
 * @param guild The guild the balance belongs to.
 * @param amount The number of coins to debit. Must be a positive, finite number, enforced by this function.
 * @returns Whether the member could afford it. `false` means nothing was deducted.
 */
export const debit = async (user: Snowflake, guild: Snowflake, amount: number): Promise<boolean> => {
    if (!Number.isFinite(amount) || amount <= 0) return false;

    const { modifiedCount } = await MemberModel.updateOne({
        user,
        guild,
        balance: { $gte: amount },
    }, {
        $inc: { balance: -amount },
    });

    return Boolean(modifiedCount);
};

/**
 * Credit coins to a member's balance, clamped at zero.
 *
 * A negative amount takes coins away without `debit`'s all-or-nothing rule:
 * the balance settles at zero rather than the write failing.
 * @param user The member's user ID.
 * @param guild The guild the balance belongs to.
 * @param amount The number of coins to credit. Use a negative value to take coins away.
 */
export const credit = async (user: Snowflake, guild: Snowflake, amount: number): Promise<void> => {
    await MemberModel.updateOne({ user, guild }, [
        {
            $set: {
                balance: clampedIncrement("balance", amount),
            },
        },
    ], { updatePipeline: true });
};

/**
 * Takes a member's stake for a wager.
 *
 * The stake leaves the balance before the outcome is known, so an interaction
 * that fails mid-game can't pay out a bet that was never funded.
 * @param user The member's user ID.
 * @param guild The guild being played in.
 * @param wager The coins being staked. Must be a positive, finite number, enforced by this function.
 * @returns The locale key explaining why the bet was refused, or `null` if it was taken.
 */
export const stake = async (user: Snowflake, guild: Snowflake, wager: number): Promise<string | null> => {
    if (!Number.isFinite(wager) || wager <= 0) return "wagerInsufficientFunds";

    const guildDocument = await GuildModel.findById(guild).select("gambling").lean();

    if (!guildDocument?.gambling) return "gamblingDisabled";
    if (!await debit(user, guild, wager)) return "wagerInsufficientFunds";

    return null;
};
