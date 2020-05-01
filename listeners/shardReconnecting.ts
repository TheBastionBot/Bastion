/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "tesseract";

export = class ShardReconnectingListener extends Listener {
    constructor() {
        super("shardReconnecting", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (shardId: number): Promise<void> => {
        Logger.info("Shard " + shardId + " - Reconnecting");
    }
}
