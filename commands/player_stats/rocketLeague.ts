/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";
import { BastionCredentials } from "../../typings/settings";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";
import * as strings from "../../utils/strings";
import * as xml from "../../utils/xml";

interface Skills {
    player_skills?: unknown[];
    season_rewards?: {
        level?: number;
        wins?: number;
    };
    user_name?: string;
    user_id?: string;
    stats?: {
        [key: string]: unknown;
    };
}

export = class RocketLeagueCommand extends Command {
    private platforms: string[];
    private skillTypes: string[];

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
        this.skillTypes = [ "assists", "goals", "mvps", "saves", "shots", "wins" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        let player = encodeURIComponent(argv._.join(" "));
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get steam id
        if (platform === "steam") {
            const response = await requests.get("https://steamcommunity.com/id/" + player + "?xml=1");
            const account: SteamProfile = xml.parse(await response.text());
            player = account?.profile?.steamID64 as string;
        }

        // get stats
        const skillsResponse = await requests.get("https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + player, {
            Authorization: "Token " + (this.client.credentials as BastionCredentials).rocketLeagueApiKey,
        });
        const skills = await skillsResponse.json();

        const data: Skills = {
            ...skills[0],
            stats: {},
        };

        for (const type of this.skillTypes) {
            const statsResponse = await requests.get("https://api.rocketleague.com/api/v1/" + platform + "/leaderboard/stats/" + type + "/" + player, {
                Authorization: "Token " + (this.client.credentials as BastionCredentials).rocketLeagueApiKey,
            });
            const stats = await statsResponse.json();

            if (stats?.[0]?.user_id) {
                data.stats[stats[0].stat_type] = stats[0].value;
            }
        }

        // check for errors
        if (!data.user_name) throw new Error("PLAYER_NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.ROCKET_LEAGUE,
                author: {
                    name: data.user_name + " / " + player,
                },
                title: "Rocket League - Player Stats",
                fields: [
                    {
                        name: "Season Reward",
                        value: "Level " + data.season_rewards
                            ? data.season_rewards?.level + (data.season_rewards?.wins ? data.season_rewards?.wins + " Wins" : "")
                            : "-",
                    },
                    ...Object.keys(data.stats).map((key: string) => ({
                        name: strings.toTitleCase(key),
                        value: data.stats[key],
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
    };
}
