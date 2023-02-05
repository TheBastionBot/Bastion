/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { CloseEvent } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

class ShardDisconnectListener extends Listener<"shardDisconnect"> {
    constructor() {
        super("shardDisconnect");
    }

    public exec(closeEvent: CloseEvent, shardId: number): void {
        if (closeEvent.wasClean) {
            Logger.info(`Shard ${ shardId } — Disconnected`);
        } else {
            Logger.info(`Shard ${ shardId } — Disconnected (${ closeEvent.code }: ${ closeEvent.reason })`);
        }
    }
}

export { ShardDisconnectListener as Listener };
