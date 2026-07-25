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

const giveawaySchema = new mongoose.Schema<Giveaway>({
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

// the active giveaway count is checked per guild before a new giveaway is
// created, and the scheduler collects due giveaways for the guilds on the shard
giveawaySchema.index({
    guild: 1,
    ends: 1,
});

export default mongoose.model<Giveaway>("Giveaway", giveawaySchema);
