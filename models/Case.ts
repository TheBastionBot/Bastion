/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as mongoose from "mongoose";

export interface Case {
    guild: string;
    number: number;
    messageId: string;
}

const caseSchema = new mongoose.Schema<Case & mongoose.Document>({
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    number: {
        type: Number,
        required: true,
        default: 1,
    },
    messageId: {
        type: String,
        required: true,
    },
});

caseSchema.index({
    guild: 1,
    number: 1,
}, {
    unique: true,
});

export default mongoose.model<Case & mongoose.Document>("Case", caseSchema);
