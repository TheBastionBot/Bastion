/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { TextChannel } from "discord.js";

export = class WebhookListener extends Listener {
    constructor() {
        super("webhookUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (channel: TextChannel): Promise<void> => {
    }
}
