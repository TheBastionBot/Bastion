/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { DMChannel, GuildChannel } from "discord.js";

export = class ChannelUpdateListener extends Listener {
    constructor() {
        super("channelUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel): Promise<void> => {
    }
}
