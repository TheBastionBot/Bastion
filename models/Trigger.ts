/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface Trigger {
    guild: string;
    trigger: string;
    responseMessage?: Record<string, unknown>;
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
        type: Object,
    },
    responseReaction: {
        type: String,
    },
});

export default mongoose.model<Trigger & mongoose.Document>("Trigger", triggerSchema);
