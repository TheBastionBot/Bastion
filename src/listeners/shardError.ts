/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Listener, Logger } from "@bastion/tesseract";

class ShardErrorListener extends Listener<"shardError"> {
    constructor() {
        super("shardError");
    }

    public exec(error: Error, shardId: number): void {
        Logger.info(`Shard ${ shardId } — Errored`);
        Logger.error(error);
    }
}

export = ShardErrorListener;
