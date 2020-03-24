/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

export = class ShardErrorListener extends Listener {
    constructor() {
        super("shardError", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (error: Error, shardId: number): Promise<void> => {
        this.client.log.info("Shard " + shardId + " - Errored");
        this.client.log.error(error);
    }
}
