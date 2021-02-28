/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as mongoose from "mongoose";

export interface Role {
    _id: string;
    id?: string;
    guild: string;
    emoji?: string;
    selfAssignable?: boolean;
    autoAssignable?: {
        forBots: boolean;
        forUsers: boolean;
    };
    referrals?: number;
    level?: number;
    price?: number;
    invite?: string;
    blacklisted?: boolean;
    disabledCommands?: string[];
}

export default mongoose.model<Role & mongoose.Document>("Role", new mongoose.Schema<Role>({
    _id: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    emoji: {
        type: String,
    },
    selfAssignable: {
        type: Boolean,
    },
    autoAssignable: {
        type: {
            forBots: {
                type: Boolean,
            },
            forUsers: {
                type: Boolean,
            },
        },
    },
    referrals: {
        type: Number,
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
    blacklisted: {
        type: Boolean,
    },
    disabledCommands: {
        type: [ String ],
    },
}));
