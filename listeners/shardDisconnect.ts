/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

export = class ShardDisconnectListener extends Listener {
    constructor() {
        super("shardDisconnect", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (event: CloseEvent, shardId: number): Promise<void> => {
        this.client.log.info("Shard " + shardId + " - Disconnected");
        if (!event.wasClean) {
            this.client.log.error(event);
        }
    }
}
