/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants } from "@bastion/tesseract";
import { ColorResolvable, EmbedFieldData, MessageEmbedAuthor, MessageEmbedFooter, MessageEmbedOptions } from "discord.js";

export interface MessageEmbedData {
    author?: MessageEmbedAuthor;
    color?: ColorResolvable;
    description?: string;
    fields?: EmbedFieldData[];
    footer?: MessageEmbedFooter;
    image?: string;
    thumbnail?: string;
    timestamp?: number | Date;
    title?: string;
    url?: string;
}

export const generateEmbed = (embed: string | MessageEmbedData): MessageEmbedOptions => {
    if (typeof embed === "string") {
        return {
            color: Constants.COLORS.IRIS,
            description: embed,
        };
    }

    return {
        author: embed.author,
        color: embed.color || Constants.COLORS.IRIS,
        description: embed.description,
        fields: embed.fields,
        footer: embed.footer,
        image: {
            url: embed.image,
        },
        thumbnail: {
            url: embed.thumbnail,
        },
        timestamp: embed.timestamp,
        title: embed.title,
        url: embed.url,
    };
};

export const generateBastionEmbed = (embed: string | MessageEmbedOptions): MessageEmbedData => {
    if (typeof embed === "string") {
        return {
            color: Constants.COLORS.IRIS,
            description: embed,
        };
    }

    return {
        author: embed.author,
        color: embed.color || Constants.COLORS.IRIS,
        description: embed.description,
        fields: embed.fields,
        footer: embed.footer,
        image: embed.image && embed.image.url,
        thumbnail: embed.thumbnail && embed.thumbnail.url,
        timestamp: embed.timestamp,
        title: embed.title,
        url: embed.url,
    };
};

export const isValidBastionEmbed = (embed: MessageEmbedData): boolean => {
    // check whether it's an embed
    if (embed.constructor !== ({}).constructor) return false;

    // check whether the author is valid
    if ("author" in embed) {
        if (embed.author.name && typeof embed.author.name !== "string") return false;
        if (embed.author.url && typeof embed.author.url !== "string") return false;
        if (embed.author.iconURL && typeof embed.author.iconURL !== "string") return false;
    }

    // check whether the color is valid
    if ("color" in embed && typeof embed.color !== "number" && typeof embed.color !== "string" && !(embed.color instanceof Array)) return false;

    // check whether the description is valid
    if ("description" in embed && typeof embed.description !== "string") return false;

    // check whether the fields are valid
    if ("fields" in embed) {
        if (!(embed.fields instanceof Array)) return;
        for (const field of embed.fields) {
            if (field.constructor !== ({}).constructor) return false;
            if (!("name" in field)) return false;
            if (!("value" in field)) return false;
            if (typeof field.inline !== "boolean") return false;
        }
    }

    // check whether the image is valid
    if ("image" in embed && typeof embed.image !== "string") return false;

    // check whether the thumbnail is valid
    if ("thumbnail" in embed && typeof embed.thumbnail !== "string") return false;

    // check whether the timestamp is valid
    if ("timestamp" in embed && typeof embed.timestamp !== "number" && !(embed.timestamp instanceof Date)) return false;

    // check whether the title is valid
    if ("title" in embed && typeof embed.title !== "string") return false;

    // check whether the url is valid
    if ("url" in embed && typeof embed.url !== "string") return false;

    // well, it's a valid embed!
    return true;
};

export const isValidEmbed = (embed: MessageEmbedOptions): boolean => {
    // check whether it's an embed
    if (embed.constructor !== ({}).constructor) return false;

    // check whether the author is valid
    if ("author" in embed) {
        if (embed.author.name && typeof embed.author.name !== "string") return false;
        if (embed.author.url && typeof embed.author.url !== "string") return false;
        if (embed.author.iconURL && typeof embed.author.iconURL !== "string") return false;
    }

    // check whether the color is valid
    if ("color" in embed && typeof embed.color !== "number" && typeof embed.color !== "string" && !(embed.color instanceof Array)) return false;

    // check whether the description is valid
    if ("description" in embed && typeof embed.description !== "string") return false;

    // check whether the fields are valid
    if ("fields" in embed) {
        if (!(embed.fields instanceof Array)) return;
        for (const field of embed.fields) {
            if (field.constructor !== ({}).constructor) return false;
            if (!("name" in field)) return false;
            if (!("value" in field)) return false;
            if (typeof field.inline !== "boolean") return false;
        }
    }

    // check whether the footer is valid
    if ("footer" in embed) {
        if (embed.footer.iconURL && typeof embed.footer.iconURL !== "string") return false;
        if (embed.footer.text && typeof embed.footer.text !== "string") return false;
    }

    // check whether the image is valid
    if ("image" in embed && embed.image.url && typeof embed.image.url !== "string") return false;

    // check whether the thumbnail is valid
    if ("thumbnail" in embed && embed.thumbnail.url && typeof embed.thumbnail.url !== "string") return false;

    // check whether the timestamp is valid
    if ("timestamp" in embed && typeof embed.timestamp !== "number" && !(embed.timestamp instanceof Date)) return false;

    // check whether the title is valid
    if ("title" in embed && typeof embed.title !== "string") return false;

    // check whether the url is valid
    if ("url" in embed && typeof embed.url !== "string") return false;

    // well, it's a valid embed!
    return true;
};
