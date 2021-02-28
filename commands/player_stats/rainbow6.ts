/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message, EmbedFieldData } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class Rainbow6Command extends Command {
    private platforms: string[];

    constructor() {
        super("rainbow6", {
            description: "It allows you to see the stats of any Rainbow 6 player in any supported platform.",
            triggers: [ "r6" ],
            arguments: {
                alias: {
                    platform: [ "p" ],
                },
                string: [ "platform" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "rainbow6 USERNAME",
                "rainbow6 USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ "uplay", "steam", "psn", "xbl" ];
    }

    private resolveRegion = (region: string): string => {
        region = region.toLowerCase();

        switch (region) {
        case "emea": return "Europe";
        case "ncsa": return "America";
        case "apac": return "Asia";
        default: return region;
        }
    };

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/rainbow6/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check whether player exists
        if (!Object.keys(response).length) throw new Error("PLAYER_DOESNT_EXIST");

        const fields: EmbedFieldData[] = [
            {
                name: "Level",
                value: response.level.level,
                inline: true,
            },
            {
                name: "XP",
                value: response.level.xp,
                inline: true,
            },
        ];

        // Rank stats
        let emblem: string;

        if (response.rank) {
            const seasons = Object.keys(response.rank.seasons);

            if (seasons.length) {
                const season = response.rank.seasons[seasons.pop()];
                // flag to check for the highest rank across regions
                let highestRank = -1;

                fields.push(
                    {
                        name: "Season - " + season.id,
                        value: season.name,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...Object.values(season.regions).map((r: any) => {
                        // rank emblem
                        if (r.current.id > highestRank) {
                            highestRank = r.current.id;
                            emblem = r.current.image;
                        }

                        return {
                            name: this.resolveRegion(r.region),
                            value: r.current.name + " - Rank " + r.current.id
                                + "\n**SKILL** " + r.skillMean.toFixed(2) + " ± " + r.skillStdev.toFixed(2)
                                + "\n" + r.kills + " kills / " + r.deaths + " deaths\n"
                                + r.wins + " wins / " + r.losses + " losses",
                            inline: true,
                        };
                    }),
                );

            }
        }

        // PvP stats
        if (response.stats.pvp && response.stats.pvp.general) {
            fields.push(
                {
                    name: "PvP",
                    value: response.user.username + " has played PvP matches for " + (response.stats.pvp.general.playtime / 60 / 60).toFixed(2) + " hours.",
                },
                {
                    name: "Matches",
                    value: response.stats.pvp.general.matches,
                    inline: true,
                },
                {
                    name: "Wins",
                    value: response.stats.pvp.general.wins,
                    inline: true,
                },
                {
                    name: "Losses",
                    value: response.stats.pvp.general.losses,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: response.stats.pvp.general.kills,
                    inline: true,
                },
                {
                    name: "Assists",
                    value: response.stats.pvp.general.assists,
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: response.stats.pvp.general.deaths,
                    inline: true,
                },
                {
                    name: "WLR",
                    value: response.stats.pvp.general.losses ? (response.stats.pvp.general.wins / response.stats.pvp.general.losses).toFixed(2) : response.stats.pvp.general.wins,
                    inline: true,
                },
                {
                    name: "LDR",
                    value: response.stats.pvp.general.deaths ? (response.stats.pvp.general.kills / response.stats.pvp.general.deaths).toFixed(2) : response.stats.pvp.general.kills,
                    inline: true,
                },
            );
        }

        // PvE stats
        if (response.stats.pve && response.stats.pve.general) {
            fields.push(
                {
                    name: "PvE",
                    value: response.user.username + " has played PvE matches for " + (response.stats.pve.general.playtime / 60 / 60).toFixed(2) + " hours.",
                },
                {
                    name: "Matches",
                    value: response.stats.pve.general.matches,
                    inline: true,
                },
                {
                    name: "Wins",
                    value: response.stats.pve.general.wins,
                    inline: true,
                },
                {
                    name: "Losses",
                    value: response.stats.pve.general.losses,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: response.stats.pve.general.kills,
                    inline: true,
                },
                {
                    name: "Assists",
                    value: response.stats.pve.general.assists,
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: response.stats.pve.general.deaths,
                    inline: true,
                },
                {
                    name: "WLR",
                    value: response.stats.pve.general.losses ? (response.stats.pve.general.wins / response.stats.pve.general.losses).toFixed(2) : response.stats.pve.general.wins,
                    inline: true,
                },
                {
                    name: "KDR",
                    value: response.stats.pve.general.deaths ? (response.stats.pve.general.kills / response.stats.pve.general.deaths).toFixed(2) : response.stats.pve.general.kills,
                    inline: true,
                },
            );
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.RAINBOW6,
                author: {
                    name: response.user.username,
                },
                title: "Rainbow 6 - Player Stats",
                fields: fields,
                thumbnail: {
                    url: emblem,
                },
                footer: {
                    text: response.user.platform.toUpperCase() + " • Powered by Ubisoft",
                },
            },
        });
    }
}
