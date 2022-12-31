/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Message, MessageType, PartialMessage, time } from "discord.js";
import { Listener } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import { logGuildEvent } from "../utils/guilds";

class MessageDeleteListener extends Listener<"messageDelete"> {
    constructor() {
        super("messageDelete");
    }

    public async exec(message: Message<boolean> | PartialMessage): Promise<void> {
        if (!message.inGuild()) return;
        if (![ MessageType.Default, MessageType.Reply ].includes(message.type)) return;

        const guildDocument = await GuildModel.findById(message.guild.id);

        await logGuildEvent(message.guild, {
            title: "Message Deleted",
            fields: [
                {
                    name: "Author",
                    value: message.author.tag,
                    inline: true,
                },
                {
                    name: "Author ID",
                    value: message.author.id,
                    inline: true,
                },
                {
                    name: "Channel",
                    value: message.channel.name,
                    inline: true,
                },
                {
                    name: "Channel ID",
                    value: message.channelId,
                    inline: true,
                },
                {
                    name: "Sent",
                    value: time(message.createdAt),
                    inline: true,
                },
                guildDocument.logContent && message.content && {
                    name: "Content",
                    value: message.content,
                    inline: false,
                }
            ].filter(x => x),
            timestamp: new Date().toISOString(),
        });
    }
}

export = MessageDeleteListener;
