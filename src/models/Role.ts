/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as mongoose from "mongoose";

export interface Role {
    _id: string;
    id?: string;
    guild: string;
    description?: string;
    emoji?: string;
    level?: number;
    price?: number;
    invite?: string;
    referrals?: number;
    autoAssignable?: boolean;
    selfAssignable?: boolean;
    bots?: boolean;
}

export default mongoose.model<Role & mongoose.Document>("Role", new mongoose.Schema<Role & mongoose.Document>({
    _id: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    description: {
        type: String,
        maxlength: 100,
    },
    emoji: {
        type: String,
    },
    level: {
        type: Number,
    },
    price: {
        type: Number,
    },
    invite: {
        type: String,
    },
    referrals: {
        type: Number,
    },
    autoAssignable: {
        type: Boolean,
    },
    selfAssignable: {
        type: Boolean,
    },
    bots: {
        type: Boolean,
    },
}));
