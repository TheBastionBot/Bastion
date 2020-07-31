/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";

export = class ShardDisconnectListener extends Listener {
    constructor() {
        super("shardDisconnect", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (event: CloseEvent, shardId: number): Promise<void> => {
        Logger.info("Shard " + shardId + " - Disconnected");
        if (!event.wasClean) {
            Logger.error(event);
        }
    }
}
