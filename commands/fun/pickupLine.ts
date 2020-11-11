/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as omnic from "../../utils/omnic";

export = class PickupLineCommand extends Command {
    constructor() {
        super("pickupLine", {
            description: "Posts a random pickup line collected from the r/pickuplines subreddit.",
            triggers: [ "pickup" ],
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
        // fetch a random joke
        const response = await omnic.makeRequest("/reddit/pickuplines/random");
        const [ post ] = await response.json();

        if (!post || !post.data || !post.data.children || !post.data.children.length || !post.data.children[0].data) return;

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: "**" + post.data.children[0].data.title + "**\n" + (post.data.children[0].data.selftext || ""),
                footer: {
                    text: "Powered by r/pickuplines",
                },
            },
        });
    }
}
