/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface Trigger {
    guild: string;
    trigger: string;
    responseMessage?: unknown;
    responseReaction?: string;
}

const triggerSchema = new mongoose.Schema<Trigger>({
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    trigger: {
        type: String,
        required: true,
    },
    responseMessage: {
        type: String,
    },
    responseReaction: {
        type: String,
    },
});

export default mongoose.model<Trigger & mongoose.Document>("Trigger", triggerSchema);
