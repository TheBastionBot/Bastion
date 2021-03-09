/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as mongoose from "mongoose";

export interface Playlist {
    guild: string;
    creator: string;
    songs: string[];
}

const playlistSchema = new mongoose.Schema<Playlist & mongoose.Document>({
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
