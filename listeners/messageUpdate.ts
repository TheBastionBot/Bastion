/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Message } from "discord.js";

export = class MessageUpdateListener extends Listener {
    constructor() {
        super("messageUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldMessage: Message, newMessage: Message): Promise<void> => {
    }
}
