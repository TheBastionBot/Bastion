/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Collection, DMChannel, Message, Snowflake } from "discord.js";

import Guild = require("../structures/Guild");

export = class MessageDeleteBulkListener extends Listener {
    constructor() {
        super("messageDeleteBulk", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (messages: Collection<Snowflake, Message>): Promise<void> => {
        if (messages.size === 0) return;

        const message = messages.first();
        if (message.channel instanceof DMChannel) return;

        const guild = message.guild as Guild;

        guild.createLog({
            event: "messageClear",
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
                    name: "Delete Count",
                    value: messages.size + " messages",
                    inline: true,
                },
            ],
        });
    }
}
