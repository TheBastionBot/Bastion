/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Guild } from "discord.js";

export = class GuildCreateListener extends Listener {
    constructor() {
        super("guildCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild): Promise<void> => {
    }
}
