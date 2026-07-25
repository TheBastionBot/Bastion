/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

export interface Poll {
    _id: string;
    id?: string;
    channel: string;
    guild: string;
    ends: Date;
}

const pollSchema = new mongoose.Schema<Poll>({
    _id: {
        type: String,
        required: true,
    },
    channel: {
        type: String,
        required: true,
        ref: "TextChannel",
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    ends: {
        type: Date,
        required: true,
        expires: 864e2,
    },
});

// the active poll count is checked per guild before a new poll is created, and
// the scheduler collects due polls for the guilds on the shard
pollSchema.index({
    guild: 1,
    ends: 1,
});

export default mongoose.model<Poll>("Poll", pollSchema);
