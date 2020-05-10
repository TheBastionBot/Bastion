/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";
import fetch from "node-fetch";

import * as errors from "../../utils/errors";

export = class FollowRedirectsCommand extends Command {
    constructor() {
        super("followRedirects", {
            description: "It follows all the redirects in the specified URL and allows you to see the final URL.",
            triggers: [ "followURL" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "followRedirects URL",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const url: string = argv._.join(" ");

        // fetch original url
        const meta = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
        });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                fields: [
                    {
                        name: "URL",
                        value: url,
                    },
                    {
                        name: "Original URL",
                        value: meta.url,
                    },
                ],
            },
        });
    }
}
