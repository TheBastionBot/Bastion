/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Collection, Message, Snowflake } from "discord.js";

export = class MessageDeleteBulkListener extends Listener {
    constructor() {
        super("messageDeleteBulk", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (messages: Collection<Snowflake, Message>): Promise<void> => {
    }
}
