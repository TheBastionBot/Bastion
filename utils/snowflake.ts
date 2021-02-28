/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Snowflake, SnowflakeUtil } from "@bastion/tesseract";

import * as numbers from "./numbers";


const isValid = (snowflake: Snowflake): boolean => {
    if (typeof snowflake !== "string") return false;
    if (!/^\d{1,20}$/.test(snowflake)) return false;

    const deconstructedSnowflake = SnowflakeUtil.deconstruct(snowflake);
    return numbers.inRange(deconstructedSnowflake.timestamp, 1420070400000, 0x3FFFFFFFFFF);
};


export {
    isValid,
};
