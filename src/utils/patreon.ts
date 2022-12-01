/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as querystring from "node:querystring";

import memcache from "./memcache";
import * as requests from "./requests";
import * as settings from "./settings";
import { patreon } from "../types";

export const CACHE_NAMESPACE = "patreon";

/**
 * Returns the list of all currently active patrons.
 * @returns {Patron[]} List of all active patrons.
 */
export const fetchPatrons = async (): Promise<patreon.Patron[]> => {
    // get patrons from cache
    const patronsCache = memcache.get(CACHE_NAMESPACE + ":patrons") as patreon.Patron[];

    // return the cached patrons, if available
    if (patronsCache) {
        return patronsCache;
    }

    const patrons: patreon.Patron[] = [];

    const qs = querystring.stringify({
        "fields[member]": "patron_status,is_follower,full_name,pledge_relationship_start,lifetime_support_cents,currently_entitled_amount_cents,last_charge_date,last_charge_status,will_pay_amount_cents",
        "fields[user]": "image_url,social_connections",
        "include": "user",
    });

    let url = "https://www.patreon.com/api/oauth2/v2/campaigns/754397/members?" + qs;

    while (url) {
        // fetch patrons
        const response = await requests.get(url, {
            Authorization: `Bearer ${ settings.get()?.patreon?.accessToken }`,
        });

        const patreonResponse: patreon.PatreonResponse = await response.body.json();

        // consolidate member & user into one data structure
        const members: patreon.Patron[] = patreonResponse.data
            .filter(entity => entity.type === "member" && entity.attributes.lifetime_support_cents)
            .map(member => {
                const user = patreonResponse.included.find(entity => entity.id === member.relationships.user.data.id);

                return Object.assign({}, member.attributes, { ...user.attributes });
            });

        // store each patrons in cache
        for (const member of members.filter(m => m.social_connections && m.social_connections.discord && m.social_connections.discord.user_id)) {
            memcache.set(CACHE_NAMESPACE + ":patrons:" + member.social_connections.discord.user_id, member, 60);
        }

        // store the patrons
        patrons.push(...members);

        // update the next page's url
        url = patreonResponse.links && patreonResponse.links.next || null;
    }

    // store the patrons in cache
    if (patrons.length) {
        memcache.set(CACHE_NAMESPACE + ":patrons", patrons, 60);
    }

    return patrons;
};

export const fetchPatronByDiscordId = async (userId: string): Promise<patreon.Patron> => {
    // get patron from cache
    const patronCache = memcache.get(CACHE_NAMESPACE + ":patrons:" + userId) as patreon.Patron;

    // return the cached patrons, if available
    if (patronCache) {
        return patronCache;
    }

    // fetch the patron
    const patrons = await fetchPatrons();
    return patrons.find(patron => patron.social_connections && patron.social_connections.discord && patron.social_connections.discord.user_id === userId);
};
