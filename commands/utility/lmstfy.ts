/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class LMSTFYCommand extends Command {
    constructor() {
        super("lmstfy", {
            description: "It allows you to send a LMGTFY link for the specified search query. Use it to teach people how to do an internet search and get answers to their questions.",
            triggers: [ "lmgtfy" ],
            arguments: {
                alias: {
                    duckduckgo: [ "ddg", "d" ],
                    google: [ "g" ],
                },
                boolean: [ "duckduckgo", "google" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "lmstfy QUERY",
                "lmstfy --duckduckgo QUERY",
                "lmstfy --google QUERY",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Let me search that for you...",
                description: "https://lmgtfy.com/?s=" + (argv.google ? "g" : "d") + "&q=" + encodeURIComponent(argv._.join(" ")),
                footer: {
                    text: "Powered by LMGTFY"
                },
            },
        });
    }
}
