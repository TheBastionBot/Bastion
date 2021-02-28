/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { GuildEmoji } from "discord.js";

import Guild = require("../structures/Guild");

export = class EmojiUpdateListener extends Listener {
    constructor() {
        super("emojiUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<void> => {
        if (oldEmoji.name === newEmoji.name) return;

        const guild = oldEmoji.guild as Guild;

        guild.createLog({
            event: "emojiUpdate",
            fields: [
                {
                    name: "Emoji ID",
                    value: oldEmoji.id,
                    inline: true,
                },
                {
                    name: "Old Emoji Name",
                    value: oldEmoji.name,
                    inline: true,
                },
                {
                    name: "New Emoji Name",
                    value: newEmoji.name,
                    inline: true,
                },
            ],
            footer: oldEmoji.managed ? "Managed" : undefined,
            timestamp: oldEmoji.createdTimestamp,
        });
    }
}
