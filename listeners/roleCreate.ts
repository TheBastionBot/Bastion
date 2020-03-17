/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Role } from "discord.js";

export = class RoleCreateListener extends Listener {
    constructor() {
        super("roleCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (role: Role): Promise<void> => {
    }
}
