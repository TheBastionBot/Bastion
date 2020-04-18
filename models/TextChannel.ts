/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface TextChannel {
    _id: string;
    id?: string;
    guild: string;
    language?: string;
    blacklisted?: boolean;
    ignoredFilters?: {
        inviteFilter?: boolean;
        linkFilter?: boolean;
        messageFilter?: boolean;
    };
    disabledCommands?: string[];
}

export default mongoose.model<TextChannel & mongoose.Document>("TextChannel", new mongoose.Schema<TextChannel>({
    _id: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    language: {
        type: String,
    },
    blacklisted: {
        type: Boolean,
    },
    ignoredFilters: {
        type: {
            inviteFilter: {
                type: Boolean,
            },
            linkFilter: {
                type: Boolean,
            },
            messageFilter: {
                type: Boolean,
            },
        },
    },
    disabledCommands: {
        type: [ String ],
    },
}));
