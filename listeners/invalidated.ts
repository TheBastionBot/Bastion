/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
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
