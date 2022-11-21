/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Listener, Logger } from "@bastion/tesseract";

class ErrorListener extends Listener<"error"> {
    constructor() {
        super("error");
    }

    public exec(error: Error): void {
        Logger.error(error);
    }
}

export = ErrorListener;
