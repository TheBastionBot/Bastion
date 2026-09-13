/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { Snowflake } from "discord.js";

import TriggerModel from "../models/Trigger.js";
import memcache from "./memcache.js";

// a trigger whose pattern has been split into the literal segments between its
// `*` wildcards, each of which may still contain `?` wildcards
export interface CompiledTrigger {
    segments: string[];
    message?: string;
    reactions?: string;
}

const CACHE_LIFETIME = 60;

const cacheKey = (guild: Snowflake): string => `triggers:${ guild }`;

/**
 * Whether the segment matches the text at the specified position, where a `?`
 * in the segment matches any single character.
 */
const matchesAt = (segment: string, text: string, position: number): boolean => {
    for (let i = 0; i < segment.length; i++) {
        if (segment[i] !== "?" && segment[i] !== text[position + i]) return false;
    }

    return true;
};

/**
 * The first position at or after the specified one where the segment matches,
 * or `-1` if it doesn't match anywhere.
 */
const indexOfSegment = (segment: string, text: string, from: number): number => {
    // a segment without a wildcard is searched natively, which is the common case
    if (!segment.includes("?")) return text.indexOf(segment, from);

    for (let position = from; position + segment.length <= text.length; position++) {
        if (matchesAt(segment, text, position)) return position;
    }

    return -1;
};

/**
 * Whether the pattern of the trigger matches the specified text.
 *
 * The segments are separated by `*`, so they only have to appear in order,
 * anywhere in the text, and none of them is ever matched twice — which is what
 * keeps a pattern from being able to make matching expensive.
 * @param trigger The compiled trigger to match.
 * @param text The text to match it against.
 */
export const matches = (trigger: CompiledTrigger, text: string): boolean => {
    let cursor = 0;

    for (const segment of trigger.segments) {
        const position = indexOfSegment(segment, text, cursor);
        if (position < 0) return false;

        cursor = position + segment.length;
    }

    return true;
};

/**
 * Get the compiled triggers of a server, from the cache whenever possible.
 * @param guild The identifier of the server.
 */
export const getTriggers = async (guild: Snowflake): Promise<CompiledTrigger[]> => {
    const cached = memcache.get(cacheKey(guild)) as CompiledTrigger[];
    if (cached) return cached;

    const triggers = await TriggerModel.find({ guild });

    const compiled = triggers.map(trigger => ({
        segments: trigger.pattern.toUpperCase().split(/\*+/).filter(Boolean),
        message: trigger.message,
        reactions: trigger.reactions,
    }));

    memcache.set(cacheKey(guild), compiled, CACHE_LIFETIME);

    return compiled;
};

/**
 * Discard the cached triggers of a server, once they've been edited.
 * @param guild The identifier of the server.
 */
export const invalidateTriggers = (guild: Snowflake): void => {
    memcache.delete(cacheKey(guild));
};
