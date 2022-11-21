/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import getEmojiRegex from "emoji-regex";

import * as snowflake from "./snowflake";

const EMOJI_REGEX = getEmojiRegex();

/**
 * Get all the unicode emojis used in the specified string.
 */
const getUnicodeEmojis = (text: string): string[] => {
    if (typeof text !== "string") return [];
    return text.match(EMOJI_REGEX) || [];
};

/**
 * Get the first unicode emoji used in the specified string.
 */
const getUnicodeEmoji = (text: string): string => {
    return getUnicodeEmojis(text)[0];
};

/**
 * Check whether the specified string is an unicode emoji.
 */
const isUnicodeEmoji = (text: string): boolean => {
    return new RegExp(`^${ EMOJI_REGEX.source }$`).test(text);
};


const parseEmoji = (text: string): string | void => {
    if (typeof text !== "string") return;

    if (snowflake.isValid(text)) return text;
    if (text.includes(":")) {
        const [ , id ] = text.match(/<a?:\w+:(\d+)>/i);
        return id;
    }
    return getUnicodeEmoji(text);
};


export {
    getUnicodeEmoji,
    getUnicodeEmojis,
    isUnicodeEmoji,
    parseEmoji,
};
