/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
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

const reactionRoleGroupSchema = new mongoose.Schema<ReactionRoleGroup>({
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
