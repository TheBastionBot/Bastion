/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";

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
