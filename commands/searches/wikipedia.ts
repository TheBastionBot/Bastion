/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

export = class WikipediaCommand extends Command {
    constructor() {
        super("wikipedia", {
            description: "It allows you to search the Wikipedia for the specified title.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "wikipedia TITLE",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 2000 ? string.slice(0, 2000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the title to search
        const title = argv._.join(" ");

        // fetch wiki
        const response = await omnic.makeRequest("/wikimedia/wikipedia/" + title);
        const wiki: {
            query: {
                pages: {
                    title: string;
                    extract: string;
                    fullurl: string;
                    thumbnail: {
                        source: string;
                    };
                }[];
            };
        } = await response.json();

        if (!wiki.query || !wiki.query.pages) throw new Error("NOT_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Wikipedia",
                    url: "https://en.wikipedia.org/",
                },
                title: wiki.query.pages[0].title,
                url: wiki.query.pages[0].fullurl,
                description: this.sanitize(wiki.query.pages[0].extract),
                image: {
                    url: wiki.query.pages[0].thumbnail.source,
                },
                footer: {
                    text: "Powered by Omnic",
                },
            },
        });
    }
}
