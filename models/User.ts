/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
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
        maxlength: 256,
    },
    cakeDay: {
        type: Date,
    },
    location: {
        type: String,
        trim: true,
        maxlength: 16,
    },
    color: {
        type: Number,
    },
    afk: {
        type: String,
        trim: true,
    },
}));
