/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as numbers from "../utils/numbers";


const DEFAUL_LEVELUP_MODIFIER = 0.42;
const DEFAUL_CURRENCY_REWARD_MODIFIER = 42;
const MAX_LEVEL = 1e10;

const computeLevel = (experience: number, modifier?: number): number => {
    if (!modifier) modifier = DEFAUL_LEVELUP_MODIFIER;
    return numbers.clamp(Math.floor(modifier * Math.sqrt(experience)), MAX_LEVEL);
};

const computeExperience = (level: number, modifier?: number): number => {
    if (!modifier) modifier = DEFAUL_LEVELUP_MODIFIER;
    return Math.floor((level / modifier) * (level / modifier));
};

const MAX_EXPERIENCE = (modifier?: number): number => {
    if (!modifier) modifier = DEFAUL_LEVELUP_MODIFIER;
    return computeExperience(MAX_LEVEL, modifier);
};


export {
    DEFAUL_CURRENCY_REWARD_MODIFIER,
    DEFAUL_LEVELUP_MODIFIER,
    MAX_LEVEL,
    MAX_EXPERIENCE,
    computeLevel,
    computeExperience,
};
