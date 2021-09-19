/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message, EmbedFieldData } from "discord.js";
import R6API from "r6api.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import { BastionCredentials } from "../../typings/settings";

export = class Rainbow6Command extends Command {
    private platforms: string[];
    private ranks: string[];

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

        this.platforms = [ "uplay", "steam", "psn", "xbl", "epic", "amazon" ];
        this.ranks = [
            "Unranked",
            "Copper 5",
            "Copper 4",
            "Copper 3",
            "Copper 2",
            "Copper 1",
            "Bronze 5",
            "Bronze 4",
            "Bronze 3",
            "Bronze 2",
            "Bronze 1",
            "Silver 5",
            "Silver 4",
            "Silver 3",
            "Silver 2",
            "Silver 1",
            "Gold 3",
            "Gold 2",
            "Gold 1",
            "Platinum 3",
            "Platinum 2",
            "Platinum 1",
            "Diamond 3",
            "Diamond 2",
            "Diamond 1",
            "Champions",
        ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // initialize
        const r6 = new R6API((this.client.credentials as BastionCredentials).ubisoft);

        // find user
        const users = await r6.findByUsername(platform, player);

        // check whether player exists
        if (!users?.length) throw new Error("PLAYER_NOT_FOUND");

        // const playtime = await r6.getPlaytime(platform, users[0].id);
        const progression = await r6.getProgression(platform, users[0].id);
        const ranks = await r6.getRanks(platform, users[0].id);
        const stats = await r6.getStats(platform, users[0].id);

        const fields: EmbedFieldData[] = [
            {
                name: "Level",
                value: progression?.[0]?.level?.toString() || "-",
                inline: true,
            },
            {
                name: "XP",
                value: progression?.[0]?.xp?.toString() || "-",
                inline: true,
            },
        ];

        // Rank stats
        let emblem: string;

        if (ranks.length) {
            const seasons = Object.keys(ranks?.[0]?.seasons || {});

            if (seasons.length) {
                const season = ranks?.[0]?.seasons[seasons.pop()];
                // flag to check for the highest rank across regions
                let highestRank = -1;

                fields.push(
                    {
                        name: "Season - " + season.seasonId,
                        value: season.seasonName,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...Object.values(season.regions).map(r => {
                        // rank emblem
                        if (r.boards.pvp_ranked.current.id > highestRank) {
                            highestRank = r.boards.pvp_ranked.current.id;
                            emblem = r.boards.pvp_ranked.current.icon.replace("undefined", this.ranks[r.boards.pvp_ranked.current.id]).replace(/ /g, "%20");
                        }

                        return {
                            name: r.regionId?.toUpperCase(),
                            value: (r.boards.pvp_ranked.current.name || this.ranks[r.boards.pvp_ranked.current.id]) + " - Rank " + r.boards.pvp_ranked.current.id
                                + "\n**SKILL** " + r.boards.pvp_ranked.skillMean.toFixed(2) + " ± " + r.boards.pvp_ranked.skillStdev.toFixed(2)
                                + "\n" + r.boards.pvp_ranked.kills + " kills / " + r.boards.pvp_ranked.deaths + " deaths\n"
                                + r.boards.pvp_ranked.wins + " wins / " + r.boards.pvp_ranked.losses + " losses",
                            inline: true,
                        };
                    }),
                );

            }
        }

        // PvP stats
        if (stats?.[0]?.pvp?.general) {
            fields.push(
                {
                    name: "PvP",
                    value: player + " has played PvP matches for " + (stats?.[0]?.pvp.general.playtime / 60 / 60).toFixed(2) + " hours.",
                },
                {
                    name: "Matches",
                    value: stats?.[0]?.pvp.general.matches,
                    inline: true,
                },
                {
                    name: "Wins",
                    value: stats?.[0]?.pvp.general.wins,
                    inline: true,
                },
                {
                    name: "Losses",
                    value: stats?.[0]?.pvp.general.losses,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: stats?.[0]?.pvp.general.kills,
                    inline: true,
                },
                {
                    name: "Assists",
                    value: stats?.[0]?.pvp.general.assists,
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: stats?.[0]?.pvp.general.deaths,
                    inline: true,
                },
                {
                    name: "WLR",
                    value: stats?.[0]?.pvp.general.losses ? (stats?.[0]?.pvp.general.wins / stats?.[0]?.pvp.general.losses).toFixed(2) : stats?.[0]?.pvp.general.wins,
                    inline: true,
                },
                {
                    name: "LDR",
                    value: stats?.[0]?.pvp.general.deaths ? (stats?.[0]?.pvp.general.kills / stats?.[0]?.pvp.general.deaths).toFixed(2) : stats?.[0]?.pvp.general.kills,
                    inline: true,
                },
            );
        }

        // PvE stats
        if (stats?.[0]?.pve?.general) {
            fields.push(
                {
                    name: "PvE",
                    value: player + " has played PvE matches for " + (stats?.[0]?.pve.general.playtime / 60 / 60).toFixed(2) + " hours.",
                },
                {
                    name: "Matches",
                    value: stats?.[0]?.pve.general.matches,
                    inline: true,
                },
                {
                    name: "Wins",
                    value: stats?.[0]?.pve.general.wins,
                    inline: true,
                },
                {
                    name: "Losses",
                    value: stats?.[0]?.pve.general.losses,
                    inline: true,
                },
                {
                    name: "Kills",
                    value: stats?.[0]?.pve.general.kills,
                    inline: true,
                },
                {
                    name: "Assists",
                    value: stats?.[0]?.pve.general.assists,
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: stats?.[0]?.pve.general.deaths,
                    inline: true,
                },
                {
                    name: "WLR",
                    value: stats?.[0]?.pve.general.losses ? (stats?.[0]?.pve.general.wins / stats?.[0]?.pve.general.losses).toFixed(2) : stats?.[0]?.pve.general.wins,
                    inline: true,
                },
                {
                    name: "KDR",
                    value: stats?.[0]?.pve.general.deaths ? (stats?.[0]?.pve.general.kills / stats?.[0]?.pve.general.deaths).toFixed(2) : stats?.[0]?.pve.general.kills,
                    inline: true,
                },
            );
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.RAINBOW6,
                author: {
                    name: users?.[0]?.username,
                },
                title: "Rainbow 6 - Player Stats",
                fields: fields,
                thumbnail: {
                    url: emblem,
                },
                footer: {
                    text: users?.[0]?.platform.toUpperCase() + " • Powered by Ubisoft",
                },
            },
        });
    }
}
