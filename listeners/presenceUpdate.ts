/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Presence } from "discord.js";

export = class PresenceListener extends Listener {
    constructor() {
        super("presenceUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldPresence: Presence, newPresence: Presence): Promise<void> => {
        // TODO: streamer role implementation
        // TODO: top games/music in the server
    }
}
