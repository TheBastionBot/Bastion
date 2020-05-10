/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class CounterStrikeGlobalOffensiveCommand extends Command {
    private platforms: string[];

    constructor() {
        super("counterStrikeGlobalOffensive", {
            description: "It allows you to see the stats of any Counter-Strike: Global Offensive player in any supported platform.",
            triggers: [ "csgo" ],
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
                "counterStrikeGlobalOffensive USERNAME",
                "counterStrikeGlobalOffensive USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ "steam" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/csgo/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check for errors
        if (response.errors) throw new Error(response.errors[0].message);

        const overview = response.data.segments.find((s: { type: string }) => s.type === "overview");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.CSGO,
                author: {
                    name: response.data.platformInfo.platformUserHandle,
                    url: "https://steamcommunity.com/id/" + response.data.platformInfo.platformUserHandle,
                },
                title: "Counter-Strike: Global Offensive - Player Stats",
                description: overview.stats.timePlayed ? response.data.platformInfo.platformUserHandle + " has played for " + (overview.stats.timePlayed.value / 60 / 60).toFixed(2) + " hours." : "",
                fields: Object.keys(overview.stats).filter(k => k !== "timePlayed").map(k => ({
                    name: overview.stats[k].displayName,
                    value: overview.stats[k].displayValue,
                    inline: true,
                })),
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
