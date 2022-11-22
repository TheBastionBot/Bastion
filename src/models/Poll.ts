/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as mongoose from "mongoose";

export interface Poll {
    _id: string;
    id?: string;
    channel: string;
    guild: string;
    ends: Date;
}

const pollSchema = new mongoose.Schema<Poll & mongoose.Document>({
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

export default mongoose.model<Poll & mongoose.Document>("Poll", pollSchema);
