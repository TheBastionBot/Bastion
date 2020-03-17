/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildEmoji } from "discord.js";

export = class EmojiCreateListener extends Listener {
    constructor() {
        super("emojiCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (emoji: GuildEmoji): Promise<void> => {
    }
}
