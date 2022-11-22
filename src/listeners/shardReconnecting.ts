/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Listener, Logger } from "@bastion/tesseract";

class ShardReconnectingListener extends Listener<"shardReconnecting"> {
    constructor() {
        super("shardReconnecting");
    }

    public exec(shardId: number): void {
        Logger.info(`Shard ${ shardId } — Reconnecting`);
    }
}

export = ShardReconnectingListener;
