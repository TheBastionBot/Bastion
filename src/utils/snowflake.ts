/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Snowflake } from "discord.js";

const isValid = (snowflake: Snowflake): boolean => {
    if (typeof snowflake !== "string") return false;
    if (!/^\d{1,20}$/.test(snowflake)) return false;
    return true;
};

export {
    isValid,
};
