/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

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
            typing: true,
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

        this.platforms = [ "steam", "psn", "xbox" ];
        this.modes = [ "solo", "solo-fpp", "duo", "duo-fpp", "squad", "squad-fpp" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];
        const mode = argv.mode && this.modes.includes(argv.mode.toLowerCase()) ? argv.mode.toLowerCase() : this.modes[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/pubg/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

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
                    text: mode.toUpperCase() + " • " + platform.toUpperCase() + " • Powered by Tracker Network",
                },
            },
        });
    }
}
