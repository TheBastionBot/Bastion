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
        this.client.log.info("Shard " + shardId + " - Ready in " + process.uptime() * 1000 + "ms");

        if (this.client.shard.count === shardId + 1) {
            this.client.log.info("Systems Ready in " + (Date.now() - parseInt(process.env.BASTION_BOOT_TIME)) + "ms");
            await this.client.shard.broadcastEval("process.env.BASTION_SHARDS_READY = true");
        }
    }
}
