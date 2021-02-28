/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class ApexLegendsCommand extends Command {
    private platforms: string[];

    constructor() {
        super("apexLegends", {
            description: "It allows you to see the stats of any Apex Legends player in any supported platform.",
            triggers: [ "apex" ],
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
                "apexLegends USERNAME",
                "apexLegends USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ "origin", "psn", "xbl" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/apexlegends/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check for errors
        if (response.errors) throw new Error(response.errors[0].message);

        const overview = response.data.segments.find((s: { type: string }) => s.type === "overview");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.APEX_LEGENDS,
                author: {
                    name: response.data.platformInfo.platformUserHandle,
                    iconURL: response.data.platformInfo.avatarUrl,
                },
                title: "Apex Legends - Player Stats",
                description: response.data.metadata.activeLegendName ? response.data.platformInfo.platformUserHandle + " is currently playing with " + response.data.metadata.activeLegendName : null,
                fields: [
                    {
                        name: "Rank",
                        value: overview.stats.rankScore ? overview.stats.rankScore.metadata.rankName + " / " + overview.stats.rankScore.displayValue : "-",
                        inline: true,
                    },
                    ...Object.keys(overview.stats).filter(k => k !== "rankScore").map(k => ({
                        name: overview.stats[k].displayName,
                        value: overview.stats[k].displayValue,
                        inline: true,
                    })),
                ],
                thumbnail: {
                    url: overview.stats.rankScore ? overview.stats.rankScore.metadata.iconUrl : response.data.platformInfo.avatarUrl,
                },
                footer: {
                    text: platform.toUpperCase() + " • Powered by Tracker Network",
                },
            },
        });
    }
}
