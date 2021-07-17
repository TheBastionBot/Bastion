/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as requests from "../../utils/requests";

export = class XKCDCommand extends Command {
    constructor() {
        super("xkcd", {
            description: "It allows you to see the latest xkcd comic strip, or the specified edition.",
            triggers: [],
            arguments: {
                alias: {
                    number: [ "n" ],
                },
                string: [ "number" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // fetch the comic strip
        const response = await requests.get("https://xkcd.com" + (argv._?.length ? "/" + argv._.join("") : "") + "/info.0.json");
        const xkcd = await response.json();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "xkcd",
                    url: "https://xkcd.com",
                },
                title: xkcd.safe_title || xkcd.title,
                description: xkcd.alt,
                fields: [
                    {
                        name: "Comic Number",
                        value: xkcd.num,
                        inline: true,
                    },
                    {
                        name: "Publication Date",
                        value: xkcd.day + "-" + xkcd.month + "-" + xkcd.year,
                        inline: true,
                    },
                    {
                        name: "Don't get it?",
                        value: "[Read the explanation.](https://www.explainxkcd.com/wiki/index.php/" + xkcd.num + ")",
                        inline: true,
                    },
                ],
                image: {
                    url: xkcd.img,
                },
                footer: {
                    text: "Powered by xkcd",
                },
            },
        });
    }
}
