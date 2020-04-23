/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { DMChannel, Message } from "discord.js";

import Guild = require("../structures/Guild");

export = class MessageDeleteListener extends Listener {
    constructor() {
        super("messageDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (message: Message): Promise<void> => {
        // if the message has partial data, fetch it
        if (message.partial) {
            message = await message.fetch();
        }

        if (message.channel instanceof DMChannel) return;

        const guild = message.guild as Guild;

        if (message.type !== "DEFAULT") return;

        guild.createLog({
            event: "messageDelete",
            fields: [
                {
                    name: "Channel",
                    value: message.channel.name,
                    inline: true,
                },
                {
                    name: "Channel ID",
                    value: message.channel.id,
                    inline: true,
                },
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
                    name: "Sent",
                    value: message.createdAt.toUTCString(),
                    inline: true,
                },
            ],
        });
    }
}
