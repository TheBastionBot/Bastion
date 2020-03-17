/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { DMChannel, GuildChannel } from "discord.js";

export = class ChannelCreateListener extends Listener {
    constructor() {
        super("channelCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (channel: DMChannel | GuildChannel): Promise<void> => {
    }
}
