/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { MessageReaction } from "discord.js";

export = class MessageReactionRemoveListener extends Listener {
    constructor() {
        super("messageReactionRemove", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (messageReaction: MessageReaction): Promise<void> => {
    }
}
