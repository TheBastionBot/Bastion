/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, Listener } from "tesseract";
import { DMChannel, Message } from "discord.js";

import Guild = require("../structures/Guild");

export = class MessageUpdateListener extends Listener {
    constructor() {
        super("messageUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldMessage: Message, newMessage: Message): Promise<void> => {
        // if the old message has partial data, fetch it
        if (oldMessage.partial) {
            oldMessage = await oldMessage.fetch();
        }
        // if the new message has partial data, fetch it
        if (newMessage.partial) {
            newMessage = await newMessage.fetch();
        }

        if (oldMessage.channel instanceof DMChannel || newMessage.channel instanceof DMChannel) return;

        if (oldMessage.content === newMessage.content) return;

        const guild = oldMessage.guild as Guild;

        if (oldMessage.type !== "DEFAULT") return;

        guild.createLog({
            event: "messageUpdate",
            fields: [
                {
                    name: "Message ID",
                    value: `[${oldMessage.id}](${oldMessage.url})`,
                    inline: true,
                },
                {
                    name: "Channel",
                    value: oldMessage.channel.name,
                    inline: true,
                },
                {
                    name: "Channel ID",
                    value: oldMessage.channel.id,
                    inline: true,
                },
                {
                    name: "Author",
                    value: oldMessage.author.tag,
                    inline: true,
                },
                {
                    name: "Author ID",
                    value: oldMessage.author.id,
                    inline: true,
                },
                {
                    name: "Sent",
                    value: oldMessage.createdAt.toUTCString(),
                    inline: true,
                },
            ],
        });
    }
}
