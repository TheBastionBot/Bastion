/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as mongoose from "mongoose";

export interface Trigger {
    guild: string;
    trigger: string;
    responseMessage?: Record<string, unknown>;
    responseReaction?: string;
}

const triggerSchema = new mongoose.Schema<Trigger & mongoose.Document>({
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
