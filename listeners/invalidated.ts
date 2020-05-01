/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "tesseract";

export = class InvalidatedListener extends Listener {
    constructor() {
        super("invalidated", {
            mode: Constants.LISTENER_MODE.ONCE,
        });
    }

    exec = async (): Promise<void> => {
        Logger.error("INVALIDATED");
    }
}
