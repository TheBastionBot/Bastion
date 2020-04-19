/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { VoiceState } from "discord.js";

export = class VoiceStateUpdateListener extends Listener {
    constructor() {
        super("voiceStateUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldVoiceState: VoiceState, newVoiceState: VoiceState): Promise<void> => {
        // TODO: Auto Pause music if all the members in the music channel leave, and vice versa
    }
}
