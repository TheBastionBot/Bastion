/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { GuildEmoji } from "discord.js";

import Guild = require("../structures/Guild");

export = class EmojiCreateListener extends Listener {
    constructor() {
        super("emojiCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (emoji: GuildEmoji): Promise<void> => {
        const guild = emoji.guild as Guild;

        guild.createLog({
            event: "emojiCreate",
            fields: [
                {
                    name: "Emoji Name",
                    value: emoji.name,
                    inline: true,
                },
                {
                    name: "Emoji ID",
                    value: emoji.id,
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
    }
}
