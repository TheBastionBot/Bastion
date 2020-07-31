/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface Transaction {
    guild: string;
    sender: string;
    receiver: string;
    amount: number;
    time: Date;
    note?: string;
}

const transactionSchema = new mongoose.Schema<Transaction>({
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    note: {
        type: String,
        trim: true,
    },
});

export default mongoose.model<Transaction & mongoose.Document>("Transaction", transactionSchema);
