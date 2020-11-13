/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export = class PHDComicsCommand extends Command {
    constructor() {
        super("phdComics", {
            description: "It allows you to see the latest PHD comic strip, or the specified one.",
            triggers: [ "phd" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "phdComics",
                "phdComics 1337",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // fetch the comic strip
        const response = await fetch("https://phdcomics.com" + (argv._.length ? "/comics/archive.php?comicid=" + argv._.join("") : ""));
        const html = await response.text();

        const { document } = new JSDOM(html).window;

        const image = document.getElementById("comic2").getAttribute("src");

        if (!image) throw new Error("I didn't find any comic. Please report it in Bastion HQ.");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "PHD Comics",
                    url: "https://phdcomics.com",
                },
                image: {
                    url: image,
                },
                footer: {
                    text: "Powered by PHD Comics",
                },
            },
        });
    }
}
