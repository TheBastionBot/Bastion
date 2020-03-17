/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { User } from "discord.js";

export = class UserUpdateListener extends Listener {
    constructor() {
        super("userUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldUser: User, newUser: User): Promise<void> => {
    }
}
