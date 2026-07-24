/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildTextBasedChannel, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { Listener } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import memcache from "../utils/memcache.js";
import { COLORS } from "../utils/constants.js";

class MessageReactionAddListener extends Listener<"messageReactionAdd"> {
    constructor() {
        super("messageReactionAdd");
    }

    public async exec(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> {
        if (user.bot) return;
        // check whether the reaction was of a star
        if (reaction.emoji.name !== "⭐") return;
        // check whether the message has the minimum reaction count
        if (reaction.count < 2) return;

        // check whether the message is already in the starboard
        if (memcache.get(`starboard:${ reaction.message.id }`)) return;

        const guildDocument = await GuildModel.findById(reaction.message.guildId);

        // check whether the message has required number of reactions
        if (reaction.count < guildDocument.starboardThreshold) return;
        // find the starboard channel
        const starboardChannel = reaction.message.guild.channels.cache.get(guildDocument.starboardChannel) as GuildTextBasedChannel;

        // check whether starboard is enabled
        if (!starboardChannel) return;

        // fetch the message
        await reaction.message.fetch();

        // check whether the message author is starring their own message
        if (reaction.message.author?.id === user.id) return;

        // extract image attachment from the message
        // although, it can be a video.
        // TODO: find a way to filter out videos.
        const imageAttachment = reaction.message.attachments.filter(a => Boolean(a.height && a.width)).first();

        // check whether the message has any content
        if (!reaction.message.content && !imageAttachment) return;

        // post the message in the starboard
        await starboardChannel.send({
            embeds: [
                {
                    color: COLORS.YELLOW,
                    author: {
                        name: reaction.message.author?.tag,
                        icon_url: (reaction.message.member ?? reaction.message.author)?.displayAvatarURL(),
                        url: reaction.message.url,
                    },
                    description: reaction.message.content,
                    image: {
                        url: imageAttachment?.url,
                    },
                    footer: {
                        text: "Starboard",
                    },
                },
            ],
        });

        // remember this message for 3 days so it isn't reposted to the starboard
        memcache.set(`starboard:${ reaction.message.id }`, true, 3 * 24 * 60);
    }
}

export { MessageReactionAddListener as Listener };
