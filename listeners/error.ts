/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";

export = class ErrorListener extends Listener {
    constructor() {
        super("error", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (error: Error): Promise<void> => {
        Logger.error(error);
    }
}
