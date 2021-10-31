/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import { getRandomPost } from "../../utils/reddit";

export = class DankMemeCommand extends Command {
    constructor() {
        super("dankmeme", {
            description: "Posts a random dank meme collected from the r/dankmemes subreddit.",
            triggers: [ "dankmemes" ],
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
        const [ post ] = await getRandomPost("dankmemes");

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
                    text: "Powered by r/dankmemes",
                },
            },
        });
    };
}
