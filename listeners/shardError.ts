/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
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
