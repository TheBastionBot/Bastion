/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember, Speaking } from "discord.js";

export = class GuildMemberSpeakingListener extends Listener {
    constructor() {
        super("guildMemberSpeaking", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (member: GuildMember, speaking: Speaking): Promise<void> => {
    }
}
