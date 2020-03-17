/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

export = class ReadyListener extends Listener {
    constructor() {
        super("ready", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (): Promise<void> => {
    }
}
