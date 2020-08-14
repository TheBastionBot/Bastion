/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

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
});

memberSchema.index({
    user: 1,
    guild: 1,
}, {
    unique: true,
});

export default mongoose.model<Member & mongoose.Document>("Member", memberSchema);
