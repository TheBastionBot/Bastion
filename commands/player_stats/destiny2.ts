/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class Destiny2Command extends Command {
    private platforms: string[];

    constructor() {
        super("destiny2", {
            description: "It allows you to see the stats of any Destiny 2 player in any supported platform.",
            triggers: [],
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
                "destiny2 USERNAME",
                "destiny2 USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ null, "xbl", "psn", "steam", "blizzard", "stadia" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? this.platforms.indexOf(argv.platform.toLowerCase()) : -1;

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/destiny2/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check whether player exists
        if (!Object.keys(response).length) throw new Error("PLAYER_DOESNT_EXIST");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.DESTINY_2,
                author: {
                    name: response.membership.displayName,
                },
                title: "Destiny 2 - Player Stats",
                description: "Last played on " + new Date(response.profile.profile.data.dateLastPlayed).toUTCString(),
                fields: [
                    {
                        name: "Playtime",
                        value: response.stats.mergedAllCharacters.merged.allTime.secondsPlayed.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Highest Light Level",
                        value: response.stats.mergedAllCharacters.merged.allTime.highestLightLevel.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Highest Light Level",
                        value: response.stats.mergedAllCharacters.merged.allTime.highestLightLevel.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Combat Rating",
                        value: response.stats.mergedAllCharacters.merged.allTime.combatRating.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Score",
                        value: response.stats.mergedAllCharacters.merged.allTime.score.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Team Score",
                        value: response.stats.mergedAllCharacters.merged.allTime.teamScore.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Kills",
                        value: response.stats.mergedAllCharacters.merged.allTime.kills.basic.displayValue + " / " + response.stats.mergedAllCharacters.merged.allTime.precisionKills.basic.displayValue + " Precision Kills",
                        inline: true,
                    },
                    {
                        name: "Assists",
                        value: response.stats.mergedAllCharacters.merged.allTime.assists.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Deaths",
                        value: response.stats.mergedAllCharacters.merged.allTime.deaths.basic.displayValue + " / " + response.stats.mergedAllCharacters.merged.allTime.suicides.basic.displayValue + " Suicides",
                        inline: true,
                    },
                    {
                        name: "KDR",
                        value: response.stats.mergedAllCharacters.merged.allTime.killsDeathsRatio.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "KDA",
                        value: response.stats.mergedAllCharacters.merged.allTime.killsDeathsAssists.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "KAD",
                        value: ((response.stats.mergedAllCharacters.merged.allTime.kills.basic.value + response.stats.mergedAllCharacters.merged.allTime.assists.basic.value) / response.stats.mergedAllCharacters.merged.allTime.deaths.basic.value).toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Win Loss Ratio",
                        value: response.stats.mergedAllCharacters.merged.allTime.winLossRatio.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Best Weapon Type",
                        value: response.stats.mergedAllCharacters.merged.allTime.weaponBestType.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Total Medals Earned",
                        value: response.stats.mergedAllCharacters.merged.allTime.allMedalsEarned.basic.displayValue,
                        inline: true,
                    },
                    {
                        name: "Extras",
                        value: response.stats.mergedAllCharacters.merged.allTime.objectivesCompleted.basic.displayValue + " Objectives Completed\n"
                            + response.stats.mergedAllCharacters.merged.allTime.adventuresCompleted.basic.displayValue + " Adventures Completed\n"
                            + response.stats.mergedAllCharacters.merged.allTime.heroicPublicEventsCompleted.basic.displayValue + " Heroic Public Events Completed",
                    },
                ],
                footer: {
                    text: this.platforms[response.membership.membershipType].toUpperCase() + " • Powered by Bungie",
                },
            },
        });
    }
}
