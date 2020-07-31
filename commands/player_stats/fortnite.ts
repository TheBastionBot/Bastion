/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class FortniteCommand extends Command {
    private platforms: string[];

    constructor() {
        super("fortnite", {
            description: "It allows you to see the stats of any Fortnite player in any supported platform.",
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
                "fortnite USERNAME",
                "fortnite USERNAME --platform PLATFORM",
            ],
        });

        this.platforms = [ "pc", "psn", "xbl" ];
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify player & platform
        const player = argv._.join(" ");
        const platform = argv.platform && this.platforms.includes(argv.platform.toLowerCase()) ? argv.platform.toLowerCase() : this.platforms[0];

        // get stats
        const rawResponse = await omnic.makeRequest("/playerstats/fortnite/" + platform + "/" + encodeURIComponent(player));
        const response = await rawResponse.json();

        // check for errors
        if (response.error) throw new Error(response.error);

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.FORTNITE,
                author: {
                    name: response.epicUserHandle,
                },
                title: "Fortnite - Player Stats",
                fields: response.lifeTimeStats.map((stat: { key: string; value: string }) => ({
                    name: stat.key,
                    value: stat.value,
                    inline: true,
                })),
                footer: {
                    text: response.platformNameLong.toUpperCase() + " • Powered by Fortnite Tracker",
                },
            },
        });
    }
}
