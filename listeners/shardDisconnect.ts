/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
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
    };
}
