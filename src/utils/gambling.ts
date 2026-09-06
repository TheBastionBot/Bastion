/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
/** The fraction of every wagered coin the house keeps — the economy's drain rate. */
export const HOUSE_EDGE = 0.05;

/**
 * The multiple of the stake a winning bet returns, given the odds of winning and of a
 * stake-returning draw. Expected value works out to `-HOUSE_EDGE` for any odds, which is
 * what keeps wagering a sink rather than a faucet.
 */
export const payout = (win: number, refund = 0): number => (1 - HOUSE_EDGE - refund) / win;

/**
 * The probability that a majority-wins flip of the given number of coins ties. This is
 * `C(n, n/2) / 2^n`, computed as the equivalent product of odd-over-even terms because the
 * binomial coefficient stops being exactly representable at n = 58.
 */
export const tieProbability = (coins: number): number => {
    if (coins % 2) return 0;

    let probability = 1;
    for (let k = 1; k <= coins / 2; k++) {
        probability *= (2 * k - 1) / (2 * k);
    }

    return probability;
};

/** The odds of calling a majority-wins coin flip correctly. */
export const flipOdds = (coins: number): { win: number; refund: number } => {
    const refund = tieProbability(coins);
    return { win: (1 - refund) / 2, refund };
};

/**
 * The coins to return on a winning bet, the stake included. Flooring keeps balances whole,
 * and only ever rounds towards the house, so it can't invert the edge.
 */
export const winnings = (wager: number, win: number, refund = 0): number => Math.floor(wager * payout(win, refund));
