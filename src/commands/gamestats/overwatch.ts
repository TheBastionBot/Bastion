/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { COLORS } from "../../utils/constants.js";
import memcache from "../../utils/memcache.js";
import * as requests from "../../utils/requests.js";

interface Rank {
    division: string;
    tier: number;
}

interface PlatformRanks {
    tank?: Rank;
    damage?: Rank;
    support?: Rank;
    open?: Rank;
    season?: number;
}

interface SummaryResponse {
    username?: string;
    avatar?: string;
    title?: string;
    endorsement?: {
        level: number;
    };
    competitive?: {
        pc?: PlatformRanks;
        console?: PlatformRanks;
    };
}

interface StatBlock {
    games_played?: number;
    games_won?: number;
    games_lost?: number;
    time_played?: number;
    winrate?: number;
    kda?: number;
    average?: {
        eliminations?: number;
        assists?: number;
        deaths?: number;
        damage?: number;
        healing?: number;
    };
}

interface StatsSummaryResponse {
    general?: StatBlock;
    heroes?: Record<string, StatBlock>;
}

// fallback when a hero key isn't in the name map
const heroName = (key: string): string => key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

interface HeroInfo {
    key: string;
    name: string;
}

const HERO_NAMES_CACHE_KEY = "overwatch:hero-names";

// display names by hero key
const heroNames = async (): Promise<Record<string, string>> => {
    let names = memcache.get(HERO_NAMES_CACHE_KEY) as Record<string, string>;

    if (!names) {
        const response = await requests.get("https://overfast-api.tekrop.fr/heroes");
        const body = await response.body.json().catch(() => null) as HeroInfo[];
        if (!body) return {};

        names = Object.fromEntries(body.map(h => [ h.key, h.name ]));
        memcache.set(HERO_NAMES_CACHE_KEY, names, 1440);
    }

    return names;
};

const duration = (seconds: number): string => {
    if (seconds < 3600) return `${ Math.round(seconds / 60) } min`;
    const hours = Math.round(seconds / 3600);
    return `${ hours } hr${ hours === 1 ? "" : "s" }`;
};

class OverwatchCommand extends Command {
    constructor() {
        super({
            name: "overwatch",
            description: "Check stats of any Overwatch 2 player.",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "username",
                    description: "The BattleTag or username of the player.",
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
        const platform = interaction.options.getString("platform") === "console" ? "console" : "pc";

        const client = interaction.client as Client;
        const player = username.replace("#", "-");
        const profile = "https://overfast-api.tekrop.fr/players/" + encodeURIComponent(player);

        const { body, statusCode } = await requests.get(profile + "/summary");
        const summary: SummaryResponse = await body.json().catch(() => null) as SummaryResponse;

        if (statusCode === 429) {
            return await interaction.editReply(client.locales.getText(interaction.guildLocale, "searchUnavailable", { item: "Overwatch players" }));
        }

        if (statusCode !== 200 || !summary) return await interaction.editReply(`The profile for **${ username }** was not found.`);

        const ranks = summary.competitive?.[platform];

        // a player who hasn't placed in a role has no rating
        const rating = (role: "tank" | "damage" | "support"): string => {
            const rank = ranks?.[role];
            return rank ? `${ rank.division.charAt(0).toUpperCase() + rank.division.slice(1) } ${ rank.tier }` : "-";
        };

        // absent for private profiles
        const statsResponse = await requests.get(profile + "/stats/summary?gamemode=competitive&platform=" + platform);
        const stats: StatsSummaryResponse = await statsResponse.body.json().catch(() => null) as StatsSummaryResponse;
        const general = statsResponse.statusCode === 200 ? stats?.general : undefined;

        // most played heroes
        const heroes = Object.entries(general ? stats.heroes || {} : {})
            .sort((a, b) => (b[1]?.time_played || 0) - (a[1]?.time_played || 0))
            .slice(0, 3);
        const names = heroes.length ? await heroNames() : {};

        await interaction.editReply({
            embeds: [
                {
                    color: COLORS.OVERWATCH,
                    author: {
                        name: "Overwatch 2 — Player Stats",
                        icon_url: "https://unavatar.io/x/PlayOverwatch",
                    },
                    title: summary.username || username,
                    description: summary.title || "",
                    url: "https://overwatch.blizzard.com/en-us/career/" + encodeURIComponent(player),
                    fields: [
                        {
                            name: "Tank",
                            value: rating("tank"),
                            inline: true,
                        },
                        {
                            name: "Damage",
                            value: rating("damage"),
                            inline: true,
                        },
                        {
                            name: "Support",
                            value: rating("support"),
                            inline: true,
                        },
                        ...(general ? [
                            {
                                name: "Games",
                                value: `**${ general.games_won || 0 }** Wins\n**${ general.games_lost || 0 }** Losses`,
                                inline: true,
                            },
                            {
                                name: "Win Rate",
                                value: `${ Math.round(general.winrate || 0) }%`,
                                inline: true,
                            },
                        ] : []),
                        ...(heroes.length ? [
                            {
                                name: "Top Heroes",
                                value: heroes.map(([ key ]) => names[key] || heroName(key)).join("\n"),
                                inline: true,
                            },
                        ] : []),
                        ...(general ? [
                            {
                                name: "Playtime",
                                value: duration(general.time_played || 0),
                                inline: true,
                            },
                            {
                                name: "Damage /10m",
                                value: Math.round(general.average?.damage || 0).toLocaleString(),
                                inline: true,
                            },
                            {
                                name: "Healing /10m",
                                value: Math.round(general.average?.healing || 0).toLocaleString(),
                                inline: true,
                            },
                        ] : []),
                    ],
                    thumbnail: {
                        url: summary.avatar,
                    },
                    footer: {
                        text: [
                            ranks?.season ? `Season ${ ranks.season }` : "",
                            `Endorsement Level ${ summary.endorsement?.level || 0 }`,
                        ].filter(Boolean).join(" • "),
                    },
                },
            ],
        });
    }
}

export { OverwatchCommand as Command };
