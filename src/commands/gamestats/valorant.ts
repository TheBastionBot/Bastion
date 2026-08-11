/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { COLORS } from "../../utils/constants.js";
import memcache from "../../utils/memcache.js";
import * as requests from "../../utils/requests.js";
import Settings from "../../utils/settings.js";

const playerCard = (card: string): string => `https://media.valorant-api.com/playercards/${ card }/wideart.png`;

interface CompetitiveTiersResponse {
    data?: {
        tiers: {
            tier: number;
            largeIcon: string;
        }[];
    }[];
}

const RANK_ICONS_CACHE_KEY = "valorant:rank-icons";

// tier badges from the current episode's set
const rankIcon = async (tier: number): Promise<string> => {
    let icons = memcache.get(RANK_ICONS_CACHE_KEY) as Record<number, string>;

    if (!icons) {
        const response = await requests.get("https://valorant-api.com/v1/competitivetiers");
        const body = await response.body.json().catch(() => null) as CompetitiveTiersResponse;

        // the last set is the current episode
        const current = body?.data?.[body.data.length - 1];
        if (!current) return undefined;

        icons = Object.fromEntries(current.tiers.map(t => [ t.tier, t.largeIcon ]));
        memcache.set(RANK_ICONS_CACHE_KEY, icons, 1440);
    }

    return icons[tier] || undefined;
};

// latam and br collapse to na
const REGIONS: Record<string, string> = {
    na: "Americas",
    latam: "Latin America",
    br: "Brazil",
    eu: "Europe",
    ap: "Asia-Pacific",
    kr: "Korea",
};

const PLATFORMS: Record<string, string> = {
    pc: "PC",
    console: "Console",
};

// e.g. "e11a4" becomes "Episode 11 Act 4"
const seasonLabel = (short: string): string => {
    const parts = /^e(\d+)a(\d+)$/i.exec(short);
    return parts ? `Episode ${ parts[1] } Act ${ parts[2] }` : short;
};

interface AccountResponse {
    data?: {
        name: string;
        tag: string;
        region: string;
        account_level: number;
        card: string;
        platforms: string[];
        updated_at: string;
    };
}

interface MMRResponse {
    data?: {
        current: {
            tier: {
                id: number;
                name: string;
            };
            rr: number;
            last_change: number;
            elo: number;
            games_needed_for_rating: number;
            leaderboard_placement: {
                rank: number;
            };
        };
        peak?: {
            season: {
                short: string;
            };
            tier: {
                id: number;
                name: string;
            };
        };
        seasonal: {
            wins: number;
            games: number;
        }[];
    };
}

class ValorantCommand extends Command {
    constructor() {
        super({
            name: "valorant",
            description: "Check stats of any Valorant player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The name tag of the player.",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "region",
                    description: "The region of the account.",
                    choices: [
                        { name: "Americas", value: "na" },
                        { name: "Europe", value: "eu" },
                        { name: "Asia-Pacific", value: "ap" },
                        { name: "Korea", value: "kr" },
                    ],
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "platform",
                    description: "The platform the player competes on.",
                    choices: [
                        { name: "PC", value: "pc" },
                        { name: "Console", value: "console" },
                    ],
                },
            ],
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<unknown> {
        await interaction.deferReply();
        const username = interaction.options.getString("username");
        const region = interaction.options.getString("region");
        const platform = interaction.options.getString("platform") || "pc";

        const client = interaction.client as Client;
        const player = username.split("#");

        const credentials = { authorization: (client.settings as Settings).get("valorantApiKey") };

        const accountResponse = await requests.get(`https://api.henrikdev.xyz/valorant/v2/account/${ encodeURIComponent(player[0]) }/${ encodeURIComponent(player[1]) }`, credentials);
        const account: AccountResponse = await accountResponse.body.json().catch(() => null) as AccountResponse;

        // a refused key is the operator's problem, not an unknown player
        if (accountResponse.statusCode === 401 || accountResponse.statusCode === 403) {
            return await interaction.editReply(client.locales.getText(interaction.guildLocale, "searchUnavailable", { item: "Valorant players" }));
        }

        if (accountResponse.statusCode !== 200 || !account?.data) return await interaction.editReply(`The profile for **${ username }** was not found in the specified region.`);

        const mmrResponse = await requests.get(`https://api.henrikdev.xyz/valorant/v3/mmr/${ region }/${ platform }/${ encodeURIComponent(player[0]) }/${ encodeURIComponent(player[1]) }`, credentials);
        const mmr: MMRResponse = await mmrResponse.body.json().catch(() => null) as MMRResponse;

        const current = mmr?.data?.current;
        const peak = mmr?.data?.peak;
        const act = mmr?.data?.seasonal?.[0];
        // a player still in placements has no rating
        const placing = current?.games_needed_for_rating > 0;
        const updated = new Date(account?.data?.updated_at);

        const badge = current ? await rankIcon(current.tier?.id) : undefined;

        // tier, plus RR when rated and the ladder rank when on it
        const rank = current
            ? `**${ current.tier?.name || "Unranked" }**`
                + (!placing && current.rr != null ? ` • ${ current.rr.toLocaleString() } RR` : "")
                + (current.leaderboard_placement?.rank ? ` • **#${ current.leaderboard_placement.rank.toLocaleString() }**` : "")
            : undefined;

        const peakRank = peak
            ? `**${ peak.tier?.name || "Unranked" }**${ peak.season?.short ? ` • ${ seasonLabel(peak.season.short) }` : "" }`
            : undefined;

        const results = current
            ? placing
                ? `**${ current.games_needed_for_rating }** Game${ current.games_needed_for_rating === 1 ? "" : "s" } Remaining`
                : act ? `**${ act.wins }** Wins • **${ act.games }** Games` : "-"
            : undefined;

        const footer = [
            REGIONS[account?.data?.region] || account?.data?.region?.toUpperCase(),
            account?.data?.platforms?.map(p => PLATFORMS[p] || p).join(", "),
        ].filter(Boolean).join(" • ");

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.VALORANT,
                    author: {
                        name: "VALORANT — Player Stats",
                        icon_url: "https://unavatar.io/x/valorant",
                    },
                    title: account?.data?.name + "#" + account?.data?.tag,
                    fields: [
                        {
                            name: "Level",
                            value: account?.data?.account_level?.toLocaleString() || "-",
                            inline: true,
                        },
                        ...(rank ? [
                            {
                                name: "Rank",
                                value: rank,
                            },
                        ] : []),
                        ...(peakRank ? [
                            {
                                name: "Peak Rank",
                                value: peakRank,
                            },
                        ] : []),
                        ...(results ? [
                            {
                                name: placing ? "Placements" : "Results",
                                value: results,
                            },
                        ] : []),
                    ],
                    thumbnail: {
                        url: badge,
                    },
                    image: {
                        url: account?.data?.card ? playerCard(account.data.card) : undefined,
                    },
                    footer: footer ? { text: footer } : undefined,
                    timestamp: Number.isNaN(updated.getTime()) ? undefined : updated.toISOString(),
                },
            ],
        });
    }
}

export { ValorantCommand as Command };
