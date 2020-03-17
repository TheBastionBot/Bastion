/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Guild } from "discord.js";

export = class GuildUpdateListener extends Listener {
    constructor() {
        super("guildUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldGuild: Guild, newGuild: Guild): Promise<void> => {
    }
}
