/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Listener, Logger } from "@bastion/tesseract";

class ShardResumeListener extends Listener<"shardResume"> {
    constructor() {
        super("shardResume");
    }

    public exec(shardId: number): void {
        Logger.info(`Shard ${ shardId } - Resumed`);
    }
}

export = ShardResumeListener;
