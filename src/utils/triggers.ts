/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { Snowflake } from "discord.js";

import TriggerModel from "../models/Trigger.js";
import memcache from "./memcache.js";

// a trigger with its glob pattern already compiled
export interface CompiledTrigger {
    pattern: RegExp;
    message?: string;
    reactions?: string;
}

const CACHE_LIFETIME = 60;

const cacheKey = (guild: Snowflake): string => `triggers:${ guild }`;

/**
 * Get the compiled triggers of a server, from the cache whenever possible.
 * @param guild The identifier of the server.
 */
export const getTriggers = async (guild: Snowflake): Promise<CompiledTrigger[]> => {
    const cached = memcache.get(cacheKey(guild)) as CompiledTrigger[];
    if (cached) return cached;

    const triggers = await TriggerModel.find({ guild });

    const compiled = triggers.map(trigger => ({
        pattern: new RegExp(trigger.pattern.replace(/\?/g, ".").replace(/\*+/g, ".*"), "i"),
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
