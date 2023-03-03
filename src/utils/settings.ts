/*!
 * @author TRACTION (iamtraction)
 * @copyright 2023
 */
import { Settings } from "@bastion/tesseract";

import { bastion } from "../types.js";

export default class BastionSettings extends Settings {
    declare protected data: bastion.Settings;

    constructor() {
        super();
    }

    /** Port */
    public get port(): string | 8377 {
        return process.env.BASTION_API_PORT || process.env.PORT || 8377;
    }

    /** Auth */
    public get auth(): string {
        return process.env.BASTION_API_AUTH || this.data.auth;
    }

    /** Music Activity */
    public get musicActivity(): boolean {
        if (process.env.BASTION_MUSIC_ACTIVITY) {
            if (process.env.BASTION_MUSIC_ACTIVITY.toLowerCase() === "true") return true;
            if (process.env.BASTION_MUSIC_ACTIVITY.toLowerCase() === "false") return false;
        }
        return this.data.musicActivity;
    }

    /** Relay Direct Messages */
    public get relayDirectMessages(): boolean | string {
        if (process.env.BASTION_RELAY_DMS) {
            if (process.env.BASTION_RELAY_DMS.toLowerCase() === "true") return true;
            if (process.env.BASTION_RELAY_DMS.toLowerCase() === "false") return false;
            return process.env.BASTION_RELAY_DMS;
        }
        return this.data.relayDirectMessages;
    }

    public get<K extends keyof bastion.Settings>(key: K): bastion.Settings[K] {
        return this.data[key];
    }
}
