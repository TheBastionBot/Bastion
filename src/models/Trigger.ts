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

const triggerSchema = new mongoose.Schema<Trigger>({
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

// every message looks up the triggers of its guild, and the pattern suffix
// also serves trigger removal
triggerSchema.index({
    guild: 1,
    pattern: 1,
});

export default mongoose.model<Trigger>("Trigger", triggerSchema);
