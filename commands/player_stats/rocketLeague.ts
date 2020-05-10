/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import * as strings from "../../utils/strings";

export = class RocketLeagueCommand extends Command {
    private platforms: string[];

    constructor() {
        super("rocketLeague", {
            description: "It allows you to see the stats of any Rocket League player in any supported platform.",
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
                "rocketLeague USERNAME",
                "rocketLeague USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ "steam", "ps4", "xboxone" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/rocketleague/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check for errors
        if (!response.user_name) throw new Error("PLAYER_NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.ROCKET_LEAGUE,
                author: {
                    name: response.user_name + " / " + player,
                },
                title: "Rocket League - Player Stats",
                fields: [
                    {
                        name: "Season Reward",
                        value: "Level " + response.season_rewards
                            ? response.season_rewards.level + (response.season_rewards.wins ? response.season_rewards.wins + " Wins" : "")
                            : "-",
                    },
                    ...Object.keys(response.stats).map((key: string) => ({
                        name: strings.toTitleCase(key),
                        value: response.stats[key],
                        inline: true,
                    })),
                ],
                thumbnail: {
                    url: "https://rocketleague.media.zestyio.com/Rocket-League-Logo-Full_On-Dark-Vertical.f1cb27a519bdb5b6ed34049a5b86e317.png",
                },
                footer: {
                    text: platform.toUpperCase() + " • Powered by Rocket League",
                },
            },
        });
    }
}
