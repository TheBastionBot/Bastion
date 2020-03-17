/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember } from "discord.js";

export = class GuildMemberRemoveListener extends Listener {
    constructor() {
        super("guildMemberRemove", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (member: GuildMember): Promise<void> => {
    }
}
