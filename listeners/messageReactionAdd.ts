/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { MessageReaction } from "discord.js";

export = class MessageReactionAddListener extends Listener {
    constructor() {
        super("messageReactionAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (messageReaction: MessageReaction): Promise<void> => {
    }
}
