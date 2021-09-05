/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";
import { BastionCredentials } from "../../typings/settings";

export = class PUBGCommand extends Command {
    private platforms: string[];
    private modes: string[];

    constructor() {
        super("pubg", {
            description: "It allows you to see the stats of any Playerunknown's Battlegrounds player in any supported platform. It also allows you to see the stats in separate game modes.",
            triggers: [],
            arguments: {
                alias: {
                    platform: [ "p" ],
                    mode: [ "m" ],
                },
                string: [ "platform", "mode" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "pubg USERNAME",
                "pubg USERNAME --platform PLATFORM",
                "pubg USERNAME --platform PLATFORM --mode MODE",
            ],
        });

        this.platforms = [ "steam", "psn", "xbox", "stadia" ];
        this.modes = [ "solo", "solo-fpp", "duo", "duo-fpp", "squad", "squad-fpp" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];
        const mode = argv.mode && this.modes.includes(argv.mode.toLowerCase()) ? argv.mode.toLowerCase() : this.modes[0];

        // get profile
        const rawProfileResponse = await requests.get("https://api.pubg.com/shards/" + platform + "/players/?filter[playerNames]=" + player, {
            Authorization: "Bearer " + (this.client.credentials as BastionCredentials).pubgApiKey,
        });
        const profileResponse = await rawProfileResponse.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response: Record<string, any> = {};
        if (profileResponse?.data?.length) {
            // get stats
            const rawStatsResponse = await requests.get("https://api.pubg.com/shards/" + platform + "/players/" + profileResponse.data[0].id + "/seasons/lifetime", {
                Authorization: "Bearer " + (this.client.credentials as BastionCredentials).pubgApiKey,
            });
            const statsResponse = await rawStatsResponse.json();

            response = {
                profile: profileResponse.data[0],
                stats: statsResponse.data,
            };
        }

        // check for errors
        if (!Object.keys(response).length) throw new Error("PLAYER_NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.PUBG,
                author: {
                    name: response.profile.attributes.name,
                },
                title: "Playerunknown's Battlegrounds - Player Stats",
                description: response.profile.attributes.name + " has played for " + response.stats.attributes.gameModeStats[mode].days
                    + " days, in which they have traveled " + response.stats.attributes.gameModeStats[mode].rideDistance.toFixed(2) + "m on vehicle and " + response.stats.attributes.gameModeStats[mode].walkDistance.toFixed(2) + "m on foot."
                    + " They've acquired " + response.stats.attributes.gameModeStats[mode].weaponsAcquired + " weapons and destroyed " + response.stats.attributes.gameModeStats[mode].vehicleDestroys + " vehicles, during that period.",
                fields: [
                    {
                        name: "Overall Points",
                        value: (response.stats.attributes.gameModeStats[mode].winPoints + (response.stats.attributes.gameModeStats[mode].killPoints * 0.2)).toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Win Points",
                        value: response.stats.attributes.gameModeStats[mode].winPoints.toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Kill Points",
                        value: response.stats.attributes.gameModeStats[mode].killPoints.toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Matches",
                        value: response.stats.attributes.gameModeStats[mode].roundsPlayed,
                        inline: true,
                    },
                    {
                        name: "Wins",
                        value: response.stats.attributes.gameModeStats[mode].wins,
                        inline: true,
                    },
                    {
                        name: "Losses",
                        value: response.stats.attributes.gameModeStats[mode].losses,
                        inline: true,
                    },
                    {
                        name: "Kills",
                        value: response.stats.attributes.gameModeStats[mode].kills + " / " + response.stats.attributes.gameModeStats[mode].headshotKills + " headshots",
                        inline: true,
                    },
                    {
                        name: "Assists",
                        value: response.stats.attributes.gameModeStats[mode].assists,
                        inline: true,
                    },
                    {
                        name: "Time Survived",
                        value: (response.stats.attributes.gameModeStats[mode].timeSurvived / 60).toFixed(2) + "min / " + (response.stats.attributes.gameModeStats[mode].longestTimeSurvived / 60).toFixed(2) + "min longest",
                        inline: true,
                    },
                    {
                        name: "Heals",
                        value: response.stats.attributes.gameModeStats[mode].heals,
                        inline: true,
                    },
                    {
                        name: "Revives",
                        value: response.stats.attributes.gameModeStats[mode].revives,
                        inline: true,
                    },
                    {
                        name: "Damage Dealt",
                        value: response.stats.attributes.gameModeStats[mode].damageDealt.toFixed(2) + " / " + response.stats.attributes.gameModeStats[mode].suicides + " suicides",
                        inline: true,
                    },
                    {
                        name: "Most Kills / Round",
                        value: response.stats.attributes.gameModeStats[mode].roundMostKills,
                        inline: true,
                    },
                    {
                        name: "Best Kill Streak",
                        value: response.stats.attributes.gameModeStats[mode].maxKillStreaks,
                        inline: true,
                    },
                    {
                        name: "Longest Kill",
                        value: response.stats.attributes.gameModeStats[mode].longestKill.toFixed(2) + "s",
                        inline: true,
                    },
                ],
                footer: {
                    text: mode.toUpperCase() + " • " + platform.toUpperCase(),
                },
            },
        });
    }
}
