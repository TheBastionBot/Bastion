/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as omnic from "../../utils/omnic";

export = class MemeCommand extends Command {
    constructor() {
        super("meme", {
            description: "Posts a random meme collected from the r/memes subreddit.",
            triggers: [ "memes" ],
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
        // fetch a random meme
        const response = await omnic.makeRequest("/reddit/memes/random");
        const [ post ] = await response.json();

        if (!post || !post.data || !post.data.children || !post.data.children.length || !post.data.children[0].data) return;

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: post.data.children[0].data.title.slice(0, 256),
                url: "https://reddit.com" + post.data.children[0].data.permalink,
                image: {
                    url: post.data.children[0].data.url,
                },
                footer: {
                    text: "Powered by r/memes",
                },
            },
        });
    }
}
