/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Guild, User } from "discord.js";

export = class GuildBanAddListener extends Listener {
    constructor() {
        super("guildBanAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild, user: User): Promise<void> => {
    }
}
