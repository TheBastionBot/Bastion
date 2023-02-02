/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

export interface Trigger {
    guild: string;
    pattern: string;
    message?: string;
    reactions?: string;
}

const triggerSchema = new mongoose.Schema<Trigger & mongoose.Document>({
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    pattern: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    reactions: {
        type: String,
    },
});

export default mongoose.model<Trigger & mongoose.Document>("Trigger", triggerSchema);
