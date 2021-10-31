/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import { getRandomPost } from "../../utils/reddit";

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
        const [ post ] = await getRandomPost("pickuplines");

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
    };
}
