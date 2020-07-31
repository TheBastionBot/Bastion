/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface Playlist {
    guild: string;
    creator: string;
    songs: string[];
}

const playlistSchema = new mongoose.Schema<Playlist>({
    guild: {
        type: String,
        required: true,
        ref: "Guild",
    },
    creator: {
        type: String,
        required: true,
        ref: "User",
    },
    songs: {
        type: [ String ],
    },
});

export default mongoose.model<Playlist & mongoose.Document>("Playlist", playlistSchema);
