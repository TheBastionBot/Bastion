/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import * as mongoose from "mongoose";

export interface SelectRoleGroup {
    _id: string;
    id?: string;
    channel: string;
    guild: string;
    roles?: string[];
    type?: number;
    ui?: number;
    min?: number;
    max?: number;
}

export default mongoose.model<SelectRoleGroup & mongoose.Document>("SelectRoleGroup", new mongoose.Schema<SelectRoleGroup & mongoose.Document>({
    _id: {
        type: String,
        required: true,
    },
    channel: {
        type: String,
        required: true,
        ref: "Channel",
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    roles: {
        type: [ String ],
        ref: "Role",
    },
    type: {
        type: Number,
    },
    ui: {
        type: Number,
    },
    min: {
        type: Number,
    },
    max: {
        type: Number,
    },
}));
