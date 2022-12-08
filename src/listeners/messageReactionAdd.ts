/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildTextBasedChannel, MessageReaction, PartialMessageReaction, PartialUser, Snowflake, User } from "discord.js";
import { Listener } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import memcache from "../utils/memcache";
import { COLORS } from "../utils/constants";

class MessageReactionAddListener extends Listener<"messageReactionAdd"> {
    constructor() {
        super("messageReactionAdd");
    }

    public async exec(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> {
        // check whether the reaction was of a star
        if (reaction.emoji.name !== "⭐") return;
        // check whether the message has the minimum reaction count
        if (reaction.count < 2) return;

        // check whether the message is already in starboard
        const starboardCache = memcache.get("starboard") as Map<Snowflake, Snowflake[]> || new Map<Snowflake, Snowflake[]>();
        const guildStarboardCache = starboardCache.get(reaction.message.guildId);
        if (guildStarboardCache?.includes(reaction.message.id)) return;

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
                        icon_url: reaction.message.member?.displayAvatarURL(),
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

        // update the starboard cache
        if (guildStarboardCache instanceof Array) {
            guildStarboardCache.push(reaction.message.id);
        } else {
            starboardCache.set(reaction.message.guildId, [ reaction.message.id ]);
        }
        memcache.set("starboard", starboardCache);
    }
}

export = MessageReactionAddListener;
