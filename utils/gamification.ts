/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as numbers from "../utils/numbers";


const DEFAUL_LEVELUP_MULTIPLIER = 0.42;
const DEFAUL_CURRENCY_REWARD_MULTIPLIER = 42;
const MAX_LEVEL = 1e10;

const computeLevel = (experience: number, multiplier?: number): number => {
    if (!multiplier) multiplier = DEFAUL_LEVELUP_MULTIPLIER;
    return numbers.clamp(Math.floor(multiplier * Math.sqrt(experience)), MAX_LEVEL);
};

const computeExperience = (level: number, multiplier?: number): number => {
    if (!multiplier) multiplier = DEFAUL_LEVELUP_MULTIPLIER;
    return Math.floor((level / multiplier) * (level / multiplier));
};

const MAX_EXPERIENCE = (multiplier?: number): number => {
    if (!multiplier) multiplier = DEFAUL_LEVELUP_MULTIPLIER;
    return computeExperience(MAX_LEVEL, multiplier);
};


export {
    DEFAUL_CURRENCY_REWARD_MULTIPLIER,
    DEFAUL_LEVELUP_MULTIPLIER,
    MAX_LEVEL,
    MAX_EXPERIENCE,
    computeLevel,
    computeExperience,
};
