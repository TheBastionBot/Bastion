/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import fetch, { RequestInit as RequestOptions, Response } from "node-fetch";
import { Guild, GuildMember, Snowflake, User } from "discord.js";

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

export enum PremiumTier {
    DIAMOND = 1,
    PLATINUM,
    GOLD,
}

type FetchPremiumTierFunction = {
    (userId: Snowflake): Promise<PremiumTier>;
    (user: User): Promise<PremiumTier>;
    (ownerId: Snowflake): Promise<PremiumTier>;
    (owner: GuildMember): Promise<PremiumTier>;
    (guildId: Snowflake): Promise<PremiumTier>;
    (guild: Guild): Promise<PremiumTier>;
}
export const fetchPremiumTier: FetchPremiumTierFunction = async (identifier: Snowflake | User | GuildMember | Guild): Promise<PremiumTier> => {
    const userId = (identifier instanceof User || identifier instanceof GuildMember) ? identifier.id : identifier instanceof Guild ? identifier.ownerID : identifier;

    // check if it's me
    if (userId === "266290969974931457") return PremiumTier.DIAMOND;

    // check whether it's a premium user
    const owner: Patron = await makeRequest("/patreon/patrons/" + userId).then(res => res.json());

    // return premium membership tier
    if (owner.patron_status === "active_patron" && owner.currently_entitled_amount_cents >= 1000) return PremiumTier.DIAMOND;
    if (owner.patron_status === "active_patron" && owner.currently_entitled_amount_cents >= 500) return PremiumTier.PLATINUM;
    if (owner.patron_status === "active_patron" && owner.currently_entitled_amount_cents >= 300) return PremiumTier.GOLD;
};
