/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";

export = class ShardErrorListener extends Listener {
    constructor() {
        super("shardError", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (error: Error, shardId: number): Promise<void> => {
        Logger.info("Shard " + shardId + " - Errored");
        Logger.error(error);
    }
}
