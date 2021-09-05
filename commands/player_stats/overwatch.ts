/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as requests from "../../utils/requests";
import * as strings from "../../utils/strings";

export = class OverwatchCommand extends Command {
    constructor() {
        super("overwatch", {
            description: "It allows you to see the stats of any Overwatch player in any supported platform.",
            triggers: [ "ow" ],
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
                "overwatch USERNAME",
                "overwatch USERNAME --platform PLATFORM",
            ],
        });
    }

    resolvePlatform(platform: string): string {
        switch (platform) {
        case "ps":
        case "playstation":
        case "psn":
            return "psn";
        case "xb":
        case "xbox":
        case "xbl":
        case "xbox-live":
            return "psn";
        case "nintendo":
        case "switch":
        case "nintendo-switch":
            return "psn";
        default:
            return "pc";
        }
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = this.resolvePlatform(argv.platform?.toLowerCase());

        // get stats
        const rawResponse = await requests.get("https://ovrstat.com/stats/" + platform + "/" + (player.replace("#", "-")));
        const response = await rawResponse.json();

        // check for errors
        if (response.message) throw new Error(response.message);

        // check for private profile
        if (response.private) throw new Error("Stats of private profiles can't be shown.\nYou can modify this setting in Overwatch under Options – Social.");

        // construct casual stats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const quickPlay: any = response.quickPlayStats && response.quickPlayStats.careerStats && response.quickPlayStats.careerStats.allHeroes
            ? [
                {
                    name: "Quick Play",
                    value: "Won " + (response.quickPlayStats.careerStats.allHeroes.game.gamesWon || 0) + " Casual matches in " + response.quickPlayStats.careerStats.allHeroes.game.timePlayed,
                },
                {
                    name: "Match Awards",
                    value: "**" + (response.quickPlayStats.careerStats.allHeroes.matchAwards.cards || 0) + "** Cards\n"
                        + "**" + (response.quickPlayStats.careerStats.allHeroes.matchAwards.medals || 0) + "** Medals\n"
                        + "**" + (response.quickPlayStats.careerStats.allHeroes.matchAwards.medalsGold || 0) + "** Gold Medals\n"
                        + "**" + (response.quickPlayStats.careerStats.allHeroes.matchAwards.medalsSilver || 0) + "** Silver Medals\n"
                        + "**" + (response.quickPlayStats.careerStats.allHeroes.matchAwards.medalsBronze || 0) + "** Bronze Medals\n",
                    inline: true,
                },
                {
                    name: "Combat",
                    value: Object.keys(response.quickPlayStats.careerStats.allHeroes.combat).map((key: string) =>
                        "**" + response.quickPlayStats.careerStats.allHeroes.combat[key] + "** " + strings.camelToTitleCase(key)
                    ),
                    inline: true,
                },
                {
                    name: "Assists",
                    value: Object.keys(response.quickPlayStats.careerStats.allHeroes.combat).map((key: string) =>
                        "**" + response.quickPlayStats.careerStats.allHeroes.combat[key] + "** " + strings.camelToTitleCase(key)
                    ),
                    inline: true,
                },
            ]
            : [];

        // construct compititive stats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const competitive: any = response.competitiveStats && response.competitiveStats.careerStats && response.competitiveStats.careerStats.allHeroes
            ? [
                {
                    name: "Competitive",
                    value: "Won " + (response.competitiveStats.careerStats.allHeroes.game.gamesWon || 0) + " Competitive matches in " + response.competitiveStats.careerStats.allHeroes.game.timePlayed,
                },
                {
                    name: "Match Awards",
                    value: "**" + (response.competitiveStats.careerStats.allHeroes.matchAwards.cards || 0) + "** Cards\n"
                        + "**" + (response.competitiveStats.careerStats.allHeroes.matchAwards.medals || 0) + "** Medals\n"
                        + "**" + (response.competitiveStats.careerStats.allHeroes.matchAwards.medalsGold || 0) + "** Gold Medals\n"
                        + "**" + (response.competitiveStats.careerStats.allHeroes.matchAwards.medalsSilver || 0) + "** Silver Medals\n"
                        + "**" + (response.competitiveStats.careerStats.allHeroes.matchAwards.medalsBronze || 0) + "** Bronze Medals\n",
                    inline: true,
                },
                {
                    name: "Combat",
                    value: Object.keys(response.competitiveStats.careerStats.allHeroes.combat).map((key: string) =>
                        "**" + response.competitiveStats.careerStats.allHeroes.combat[key] + "** " + strings.camelToTitleCase(key)
                    ),
                    inline: true,
                },
                {
                    name: "Assists",
                    value: Object.keys(response.competitiveStats.careerStats.allHeroes.combat).map((key: string) =>
                        "**" + response.competitiveStats.careerStats.allHeroes.combat[key] + "** " + strings.camelToTitleCase(key)
                    ),
                    inline: true,
                },
            ]
            : [];

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.OVERWATCH,
                author: {
                    name: response.name,
                    iconURL: response.levelIcon,
                },
                title: "Overwatch - Player Stats",
                fields: [
                    {
                        name: "Games Won",
                        value: response.gamesWon,
                        inline: true,
                    },
                    {
                        name: "Level",
                        value: response.prestige * 100 + response.level,
                        inline: true,
                    },
                    {
                        name: "Endorsement",
                        value: response.endorsement,
                        inline: true,
                    },
                    {
                        name: "Tank Skill Rating",
                        value: response.ratings && response.ratings.length ? response.ratings.find((r: { role: string }) => r.role === "tank").level : "-",
                        inline: true,
                    },
                    {
                        name: "Damage Skill Rating",
                        value: response.ratings && response.ratings.length ? response.ratings.find((r: { role: string }) => r.role === "damage").level : "-",
                        inline: true,
                    },
                    {
                        name: "Support Skill Rating",
                        value: response.ratings && response.ratings.length ? response.ratings.find((r: { role: string }) => r.role === "support").level : "-",
                        inline: true,
                    },
                ].concat(quickPlay).concat(competitive),
                thumbnail: {
                    url: response.icon,
                },
                footer: {
                    text: platform.toUpperCase() + " • Powered by Overwatch",
                },
            },
        });
    }
}
