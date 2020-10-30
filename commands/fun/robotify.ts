/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command } from "@bastion/tesseract";
import { Message } from "discord.js";


export = class RobotifyCommand extends Command {
    constructor() {
        super("robotify", {
            description: "It allows you to generate a robot avatar that's unique to you.",
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
            files: [ { name: "avatar.png", attachment: "https://robohash.org/" + encodeURIComponent(message.author.tag) + "?set=set0" } ]
        });
    }
}
