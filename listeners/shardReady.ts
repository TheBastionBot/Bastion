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

    exec = async (shardId: number): Promise<void> => {
        this.client.log.info("Shard " + shardId + " - Ready");

        if (!process.env.BASTION_SHARDS_READY && this.client.shard.count === shardId + 1) {
            this.client.log.info("Systems Ready!");
            await this.client.shard.broadcastEval("process.env.BASTION_SHARDS_READY = true");
        }
    }
}
