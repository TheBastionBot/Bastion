/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
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
    voting?: boolean;
    disabledCommands?: string[];
}

export default mongoose.model<TextChannel & mongoose.Document>("TextChannel", new mongoose.Schema<TextChannel & mongoose.Document>({
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
    voting: {
        type: Boolean,
    },
    disabledCommands: {
        type: [ String ],
    },
}));
