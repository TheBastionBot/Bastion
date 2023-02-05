/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { APIEmbed } from "discord.js";

import { COLORS } from "./constants.js";

export const generate = (embed: string | APIEmbed, force?: boolean): string | APIEmbed => {
    // check whether this is a valid embed string
    if (typeof embed === "string") {
        try {
            const newEmbed = JSON.parse(embed);
            if (isValid(newEmbed)) {
                embed = newEmbed;
            }
        } catch {
            // this error can be ignored
        }
    }

    if (typeof embed === "string") {
        if (force) {
            return {
                color: COLORS.PRIMARY,
                description: embed,
            };
        }
        return embed;
    }

    return {
        ...embed,
        color: embed.color || COLORS.PRIMARY,
    };
};

export const isValid = (embed: APIEmbed): boolean => {
    // check whether it's an embed object
    if (embed?.constructor !== ({}).constructor) return false;

    // check whether the author is valid
    if ("author" in embed) {
        if (embed.author.constructor !== ({}).constructor) return false;
        if (typeof embed.author?.name !== "string") return false;
        if ("url" in embed.author && typeof embed.author.url !== "string") return false;
        if ("icon_url" in embed.author && typeof embed.author?.icon_url !== "string") return false;
    }

    // check whether the color is valid
    if ("color" in embed && typeof embed.color !== "number") return false;

    // check whether the description is valid
    if ("description" in embed && typeof embed.description !== "string") return false;

    // check whether the fields are valid
    if ("fields" in embed) {
        if (!(embed.fields instanceof Array)) return;
        for (const field of embed.fields) {
            if (field?.constructor !== ({}).constructor) return false;
            if (!("name" in field)) return false;
            if (!("value" in field)) return false;
            if ("inline" in field && typeof field.inline !== "boolean") return false;
        }
    }

    // check whether the footer is valid
    if ("footer" in embed) {
        if (embed.footer.constructor !== ({}).constructor) return false;
        if ("text" in embed.footer && typeof embed.footer?.text !== "string") return false;
        if ("icon_url" in embed.footer && typeof embed.footer?.icon_url !== "string") return false;
    }

    // check whether the image is valid
    if ("image" in embed && typeof embed.image?.url !== "string") return false;

    // check whether the thumbnail is valid
    if ("thumbnail" in embed && typeof embed.thumbnail?.url !== "string") return false;

    // check whether the timestamp is valid
    if ("timestamp" in embed && typeof embed.timestamp !== "string") return false;

    // check whether the title is valid
    if ("title" in embed && typeof embed.title !== "string") return false;

    // check whether the url is valid
    if ("url" in embed && typeof embed.url !== "string") return false;

    // well, it's a valid embed!
    return true;
};
