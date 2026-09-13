/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import * as regex from "../regex.js";

// cyrillic and greek characters commonly substituted for latin ones to break
// naive matching. digits are deliberately not folded — doing so collides
// ordinary messages that differ only by a number.
const CONFUSABLES: Record<string, string> = {
    "а": "a", "в": "b", "с": "c", "е": "e", "ѕ": "s", "т": "t",
    "н": "h", "к": "k", "м": "m", "о": "o", "р": "p", "у": "y", "х": "x",
    "α": "a", "ο": "o", "ρ": "p", "ν": "v", "ι": "i",
};

// all current keys are single BMP characters, none of which is `]`, `\`,
// `^` or `-`, so they're safe to drop into a character class unescaped. any
// new key must keep that property, or escape itself here.
const CONFUSABLES_PATTERN = new RegExp(`[${ Object.keys(CONFUSABLES).join("") }]`, "gu");

const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;
const COMBINING_MARKS = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC = /[^\p{L}\p{N}\p{M} ]/gu;
const WHITESPACE = /\s+/g;

// matchAll requires a global regex, and the shared URL_HOST pattern is
// deliberately not global (see regex.ts), so a global copy is derived once
// here rather than allocating a new RegExp on every call to hostnames().
const URL_HOST_GLOBAL = new RegExp(regex.URL_HOST, `${ regex.URL_HOST.flags }g`);

/**
 * Normalize message content so that trivial mutations like case, diacritics,
 * zero width padding, homoglyphs, punctuation, and spacing collapse to the
 * same string.
 * @param content The raw message content.
 */
export const normalize = (content: string): string => {
    if (!content) return "";

    const folded = content.normalize("NFKD").replace(ZERO_WIDTH, "").replace(COMBINING_MARKS, "").toLowerCase()
        .replace(CONFUSABLES_PATTERN, character => CONFUSABLES[character]);

    return folded.replace(NON_ALPHANUMERIC, " ").replace(WHITESPACE, " ").trim();
};

/**
 * 32 bit FNV-1a hash of the normalized message content.
 * @param content The raw message content.
 */
export const hash = (content: string): number => {
    const normalized = normalize(content);

    if (!normalized) return 0;

    let value = 0x811C9DC5;
    for (let i = 0; i < normalized.length; i++) {
        value ^= normalized.charCodeAt(i);
        value = Math.imul(value, 0x01000193);
    }

    return value >>> 0;
};

/**
 * Extract the distinct hostnames linked in the message content.
 * @param content The raw message content.
 */
export const hostnames = (content: string): string[] => {
    if (!content) return [];

    const found = new Set<string>();

    for (const match of content.matchAll(URL_HOST_GLOBAL)) {
        found.add(match[1].toLowerCase());
    }

    // match bare invites like `discord.gg/abc`
    if (regex.SERVER_INVITE.test(content)) {
        found.add("discord.gg");
    }

    return [ ...found ];
};

/**
 * Fingerprint attachments from their metadata alone. No file content is read.
 * @param attachments The name and size of each attachment.
 */
export const attachmentFingerprints = (attachments: { name: string; size: number }[]): string[] =>
    attachments.map(attachment => `${ attachment.name.toLowerCase() }|${ attachment.size }`);
