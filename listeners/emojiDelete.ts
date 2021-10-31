/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";
import { GuildEmoji } from "discord.js";

import Guild = require("../structures/Guild");

export = class EmojiDeleteListener extends Listener {
    constructor() {
        super("emojiDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (emoji: GuildEmoji): Promise<void> => {
        const guild = emoji.guild as Guild;

        guild.createLog({
            event: "emojiDelete",
            fields: [
                {
                    name: "Emoji Name",
                    value: emoji.name,
                    inline: true,
                },
                {
                    name: "Emoji Identifier",
                    value: emoji.identifier,
                    inline: true,
                },
            ],
            footer: emoji.managed ? "Managed" : undefined,
            timestamp: emoji.createdTimestamp,
        });
    };
}
