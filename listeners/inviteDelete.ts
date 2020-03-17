/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Invite } from "discord.js";

export = class InviteDeleteListener extends Listener {
    constructor() {
        super("inviteDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (invite: Invite): Promise<void> => {
    }
}
