/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface ScheduledCommand {
    _id: string;
    id?: string;
    guild: string;
    channelId: string;
    cronTime: string;
    command: string;
    arguments?: string;
}

const scheduledCommandSchema = new mongoose.Schema<ScheduledCommand>({
    _id: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    channelId: {
        type: String,
        required: true,
    },
    cronTime: {
        type: String,
        required: true,
    },
    command: {
        type: String,
        required: true,
    },
    arguments: {
        type: String,
        required: true,
    },
});

export default mongoose.model<ScheduledCommand & mongoose.Document>("ScheduledCommand", scheduledCommandSchema);
