/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Listener, Logger } from "@bastion/tesseract";

class ShardReadyListener extends Listener<"shardReady"> {
    constructor() {
        super("shardReady");
    }

    public exec(shardId: number): void {
        Logger.info(`Shard ${ shardId } — Ready`);
    }
}

export { ShardReadyListener as Listener };
