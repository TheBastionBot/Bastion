/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as mongoose from "mongoose";

export interface ReactionRoleGroup {
    _id: string;
    id?: string;
    channel: string;
    guild: string;
    roles: string[];
    exclusive?: boolean;
}

const reactionRoleGroupSchema = new mongoose.Schema<ReactionRoleGroup & mongoose.Document>({
    _id: {
        type: String,
        required: true,
    },
    channel: {
        type: String,
        required: true,
        ref: "TextChannel",
    },
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    roles: {
        type: [ String ],
    },
    exclusive: {
        type: Boolean,
    },
});

export default mongoose.model<ReactionRoleGroup & mongoose.Document>("ReactionRoleGroup", reactionRoleGroupSchema);
