/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";

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
