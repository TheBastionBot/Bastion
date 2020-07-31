/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface User {
    _id: string;
    id?: string;
    backdrop?: string;
    info?: string;
    cakeDay?: Date;
    location?: string;
    color?: number;
    afk?: string;
}

export default mongoose.model<User & mongoose.Document>("User", new mongoose.Schema<User>({
    _id: {
        type: String,
        required: true,
    },
    backdrop: {
        type: String,
        trim: true,
    },
    info: {
        type: String,
        trim: true,
    },
    cakeDay: {
        type: Date,
    },
    location: {
        type: String,
        trim: true,
    },
    color: {
        type: Number,
    },
    afk: {
        type: String,
        trim: true,
    },
}));
