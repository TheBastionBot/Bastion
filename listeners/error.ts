/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
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
