/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as numbers from "./numbers.js";

const DEFAUL_LEVELUP_MULTIPLIER = 0.42;
const DEFAUL_CURRENCY_REWARD_MULTIPLIER = 42;
const MAX_EXPERIENCE = 1e9;

const computeLevel = (experience: number, multiplier?: number): number => {
    if (!multiplier) multiplier = DEFAUL_LEVELUP_MULTIPLIER;
    return Math.max(0, Math.floor(multiplier * Math.sqrt(numbers.clamp(experience, 0, MAX_EXPERIENCE))));
};

const computeExperience = (level: number, multiplier?: number): number => {
    if (!multiplier) multiplier = DEFAUL_LEVELUP_MULTIPLIER;
    return Math.floor((level / multiplier) * (level / multiplier));
};

export {
    DEFAUL_CURRENCY_REWARD_MULTIPLIER,
    DEFAUL_LEVELUP_MULTIPLIER,
    MAX_EXPERIENCE,
    computeLevel,
    computeExperience,
};
