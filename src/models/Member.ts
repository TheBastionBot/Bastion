/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

export interface Member {
    user: string;
    guild: string;
    balance?: number;
    experience?: number;
    level?: number;
    karma?: number;
    lastClaimed?: number;
    claimStreak?: number;
    infractions?: string[];
    referral?: string;
    boost?: number;
}

const memberSchema = new mongoose.Schema<Member>({
    user: {
        type: String,
        required: true,
        ref: "User",
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    experience: {
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: Number,
        required: true,
        default: 0,
    },
    karma: {
        type: Number,
        required: true,
        default: 0,
    },
    lastClaimed: {
        type: Number,
    },
    claimStreak: {
        type: Number,
        required: true,
        default: 0,
    },
    infractions: {
        type: [ String ],
    },
    referral: {
        type: String,
    },
    boost: {
        type: Number,
    },
});

memberSchema.index({
    user: 1,
    guild: 1,
}, {
    unique: true,
});

// serves the guild leaderboard and the member rank, which filter by guild and
// order by these fields, in this order
memberSchema.index({
    guild: 1,
    level: -1,
    experience: -1,
    karma: -1,
    balance: -1,
});

export default mongoose.model<Member>("Member", memberSchema);
