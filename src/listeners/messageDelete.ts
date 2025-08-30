/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Message, MessageType, PartialMessage, time } from "discord.js";
import { Listener } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import { logGuildEvent } from "../utils/guilds.js";

class MessageDeleteListener extends Listener<"messageDelete"> {
    constructor() {
        super("messageDelete");
    }

    public async exec(message: Message<boolean> | PartialMessage): Promise<void> {
        if (message.author.bot) return;
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
                guildDocument.serverLogContent && message.content && {
                    name: "Content",
                    value: message.content,
                },
            ].filter(f => f),
            timestamp: new Date().toISOString(),
        });
    }
}

export { MessageDeleteListener as Listener };
