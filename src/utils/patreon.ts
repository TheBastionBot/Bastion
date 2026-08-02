/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as querystring from "node:querystring";
import { Logger } from "@bastion/tesseract";

import * as requests from "./requests.js";
import Settings from "./settings.js";
import { patreon } from "../types.js";

/** How long a fetched list is served before Patreon is asked again, in milliseconds. */
const REFRESH_TTL = 36e5;
/** How long before Patreon is asked again after it couldn't be reached, in milliseconds. */
const RETRY_DELAY = 3e5;

const qs = querystring.stringify({
    "fields[member]": "patron_status,is_follower,full_name,pledge_relationship_start,lifetime_support_cents,currently_entitled_amount_cents,last_charge_date,last_charge_status,will_pay_amount_cents",
    "fields[user]": "image_url,social_connections",
    "include": "user",
});
const PATRONS_URL = "https://www.patreon.com/api/oauth2/v2/campaigns/754397/members?" + qs;

/** The patrons Patreon last answered with, held past their lifetime to serve while it can't be reached. */
let patrons: patreon.Patron[] = [];
/** When Patreon is asked again, whether the last answer was a list or a failure. */
let askAt = 0;
/** A list already being asked for, so everything asking at once waits for one instead of several. */
let fetching: Promise<patreon.Patron[]> = null;

/** Walks the campaign's members, a page at a time. */
const fetchFromPatreon = async (): Promise<patreon.Patron[]> => {
    const settings = new Settings();
    const collected: patreon.Patron[] = [];
    const walked = new Set<string>();

    let url = PATRONS_URL;

    while (url) {
        // prevent infinite loop if a page points back at an already walked page
        if (walked.has(url)) throw new Error("Patreon paged back to somewhere it had already sent us.");
        walked.add(url);

        const response = await requests.get(url, {
            Authorization: `Bearer ${ settings.get("patreon")?.accessToken }`,
        });

        if (response.statusCode >= 400) {
            throw new Error(`Patreon responded with ${ response.statusCode }: ${ await response.body.text().catch(() => "") }`);
        }

        const page = await response.body.json() as patreon.PatreonResponse;

        // throw error instead of returning a partial list
        if (!page?.data) throw new Error("Patreon answered without any members.");

        for (const member of page.data) {
            if (member.type !== "member" || !member.attributes?.lifetime_support_cents) continue;

            const user = page.included?.find(entity => entity.id === member.relationships?.user?.data?.id);
            collected.push({ ...member.attributes, ...user?.attributes });
        }

        url = page.links?.next || null;
    }

    return collected;
};

/** Asks Patreon for a fresher list, keeping the one it already has if it can't be reached. */
const refresh = async (): Promise<patreon.Patron[]> => {
    try {
        patrons = await fetchFromPatreon();
        askAt = Date.now() + REFRESH_TTL;
    } catch (e) {
        Logger.error(e);

        // prevent flooding the Patreon API when there's an outage
        askAt = Date.now() + RETRY_DELAY;
    } finally {
        fetching = null;
    }

    return patrons;
};

/**
 * Return last known patrons if Patreon can't be reached.
 */
export const fetchPatrons = async (): Promise<patreon.Patron[]> => {
    if (askAt > Date.now()) return patrons;

    return fetching ??= refresh();
};

export const fetchPatronByDiscordId = async (userId: string): Promise<patreon.Patron> =>
    (await fetchPatrons()).find(patron => patron.social_connections?.discord?.user_id === userId);
