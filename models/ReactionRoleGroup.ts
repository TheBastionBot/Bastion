/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface ReactionRoleGroup {
    _id: string;
    id?: string;
    roles: string[];
    exclusive?: boolean;
}

const playlistSchema = new mongoose.Schema<ReactionRoleGroup>({
    _id: {
        type: String,
        required: true,
    },
    roles: {
        type: [ String ],
    },
    exclusive: {
        type: Boolean,
    },
});

export default mongoose.model<ReactionRoleGroup & mongoose.Document>("ReactionRoleGroup", playlistSchema);
