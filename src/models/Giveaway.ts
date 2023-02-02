/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

export interface Giveaway {
    _id: string;
    id?: string;
    channel: string;
    guild: string;
    winners: number;
    ends: Date;
}

const giveawaySchema = new mongoose.Schema<Giveaway & mongoose.Document>({
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
    winners: {
        type: Number,
    },
    ends: {
        type: Date,
        required: true,
        expires: 864e2,
    },
});

export default mongoose.model<Giveaway & mongoose.Document>("Giveaway", giveawaySchema);
