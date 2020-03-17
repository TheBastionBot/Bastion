/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

export = class ShardResumeListener extends Listener {
    constructor() {
        super("shardResume", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (shardId: number, replayedEvents: number): Promise<void> => {
    }
}
