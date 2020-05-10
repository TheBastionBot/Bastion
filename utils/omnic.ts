/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import fetch, { RequestInit as RequestOptions, Response } from "node-fetch";
import { Guild, Snowflake } from "discord.js";

export const BASE_PATH = "https://omnic.traction.one/";

export const resolvePath = (path: string): string => BASE_PATH + (BASE_PATH.endsWith("/") ? path.replace(/^\//g, "") : path);

export const makeRequest = (path: string, options?: RequestOptions): Promise<Response> => {
    const requestOptions: RequestOptions = {
        method: "GET",
        headers: {
            "Accepts": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Bastion (Discord Bot; https://bastion.traction.one)",
        },
        ...options,
    };

    return fetch(resolvePath(path), requestOptions);
};

export const isPremiumUser = async (userId: Snowflake): Promise<boolean> => {
    // check whether it's one of my guild
    if (userId === "266290969974931457") return true;
    // check whether it's a premium user
    const owner: Patron = await makeRequest("/patreon/patrons/" + userId).then(res => res.json());
    if (owner.patron_status === "active_patron" && owner.currently_entitled_amount_cents >= 300) return true;
    // otherwise, this ain't a premium user
    return false;
};

export const isPremiumGuild = async (guild: Guild): Promise<boolean> => {
    // check whether the guild owner is a premium user
    return isPremiumUser(guild.ownerID);
};
