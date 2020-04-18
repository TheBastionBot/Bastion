/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as emojis from "../assets/emojis.json";
import * as snowflake from "./snowflake";


interface Emoji {
    /** The value, representing an emoji, that can be stored in the DataStore. */
    value: string;
    /** The value that is used to add this emoji as a message reaction. */
    reaction: string;
}

const getEmojis = (): string[] => {
    return emojis;
};

const isUnicodeEmoji = (emoji: string): boolean => {
    return emojis.includes(Buffer.from(emoji).toString("base64"));
};

const parseEmoji = (emoji: string): Emoji => {
    if (!emoji) return;

    let emojiObject: Emoji;

    if (emojis.includes(emoji)) {
        emojiObject = {
            value: emoji,
            reaction: Buffer.from(emoji, "base64").toString("utf-8"),
        };
    }
    else if (emojis.includes(Buffer.from(emoji).toString("base64"))) {
        emojiObject = {
            value: Buffer.from(emoji).toString("base64"),
            reaction: emoji,
        };
    } else if (emoji.includes(":")) {
        const [ , id ] = emoji.match(/<a?:\w+:(\d+)>/i);

        emojiObject = {
            value: id,
            reaction: id,
        };
    } else if (snowflake.isValid(emoji)) {
        emojiObject = {
            value: emoji,
            reaction: emoji,
        };
    }

    return emojiObject;
};


export {
    getEmojis,
    isUnicodeEmoji,
    parseEmoji,
};
