/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command } from "@bastion/tesseract";
import { Message } from "discord.js";


export = class CatifyCommand extends Command {
    constructor() {
        super("catify", {
            description: "It allows you to generate a cat that's unique to you.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        await message.channel.send({
            files: [ { name: "avatar.png", attachment: "https://robohash.org/" + encodeURIComponent(message.author.tag) + "?set=set4" } ]
        });
    }
}
