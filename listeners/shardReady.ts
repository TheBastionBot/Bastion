/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

export = class ShardReadyListener extends Listener {
    constructor() {
        super("shardReady", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (shardId: number, unavailableGuilds?: Set<string>): Promise<void> => {
    }
}
