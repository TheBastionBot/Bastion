/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

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

const roleSchema = new mongoose.Schema<Role>({
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
});

// every role lookup is scoped to a guild, and the level suffix additionally
// serves the level role queries
roleSchema.index({
    guild: 1,
    level: 1,
});

export default mongoose.model<Role>("Role", roleSchema);
