/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as roasts from "../../assets/roasts.json";

export = class RoastCommand extends Command {
    constructor() {
        super("roast", {
            description: "It allows you to get roasted. The thicker the skin, the better the roast.",
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
        // acknowledge
        await message.channel.send(roasts[Math.floor(Math.random() * roasts.length)]);
    }
}
