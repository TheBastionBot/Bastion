/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as omnic from "../../utils/omnic";

export = class PunCommand extends Command {
    constructor() {
        super("pun", {
            description: "Posts a random pun collected from the r/puns subreddit.",
            triggers: [ "puns" ],
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
        const response = await omnic.makeRequest("/reddit/puns/random");
        const [ post ] = await response.json();

        if (!post || !post.data || !post.data.children || !post.data.children.length || !post.data.children[0].data) return;

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: post.data.children[0].data.title.slice(0, 256),
                url: "https://reddit.com" + post.data.children[0].data.permalink,
                ...(post.data.children[0].data.selftext ? { description: post.data.children[0].data.selftext.slice(0, 1024) } : {}),
                image: {
                    url: post.data.children[0].data.url,
                },
                footer: {
                    text: "Powered by r/puns",
                },
            },
        });
    }
}
