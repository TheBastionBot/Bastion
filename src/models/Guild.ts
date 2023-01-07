/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import mongoose from "mongoose";

export interface Guild {
    _id: string;
    id?: string;
    chat?: boolean;
    // greetings
    greetingChannel?: string;
    greetingMessage?: string;
    greetingMessageTimeout?: number;
    // farewell
    farewellChannel?: string;
    farewellMessage?: string;
    farewellMessageTimeout?: number;
    // music
    music?: boolean;
    musicChannel?: string;
    musicRole?: string;
    // gamification
    gamification?: boolean;
    gamificationMessages?: boolean;
    gamificationChannel?: string;
    gamificationMultiplier?: number;
    // gambling
    gambling?: boolean;
    gamblingMultiplier?: number;
    // infractions
    infractionsTimeoutThreshold?: number;
    infractionsKickThreshold?: number;
    infractionsBanThreshold?: number;
    // invite filter
    inviteFilter?: boolean;
    inviteFilterWarnings?: boolean;
    inviteFilterExemptions?: string[];
    // link filter
    linkFilter?: boolean;
    linkFilterWarnings?: boolean;
    linkFilterExemptions?: string[];
    // message filter
    messageFilter?: boolean;
    messageFilterWarnings?: boolean;
    messageFilterPatterns?: string[];
    // spam filters
    mentionSpamThreshold?: number;
    // starboard
    starboardChannel?: string;
    starboardThreshold?: number;
    // logs
    moderationLogChannel?: string;
    serverLogChannel?: string;
    serverLogContent?: boolean;
    // special channels and roles
    suggestionsChannel?: string;
    reportsChannel?: string;
    streamerRole?: string;
    autoThreadChannels?: string[];
    votingChannels?: string[];
    // twitch notifications
    twitchNotificationChannel?: string;
    twitchNotificationMessage?: string;
    twitchNotificationUsers?: string[];
    // voice sessions
    voiceSessionCategories?: string[];
    voiceSessionUserLimit?: number;
    // boosts
    boosts?: number;
    // verification
    verifiedRole?: string;
}

export default mongoose.model<Guild & mongoose.Document>("Guild", new mongoose.Schema<Guild & mongoose.Document>({
    _id: {
        type: String,
        required: true,
    },
    chat: {
        type: Boolean,
    },
    greetingChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    greetingMessage: {
        type: String,
        trim: true,
    },
    greetingMessageTimeout: {
        type: Number,
    },
    farewellChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    farewellMessage: {
        type: String,
        trim: true,
    },
    farewellMessageTimeout: {
        type: Number,
    },
    music: {
        type: Boolean,
    },
    musicChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    musicRole: {
        type: String,
        unique: true,
        sparse: true,
    },
    gamification: {
        type: Boolean,
    },
    gamificationMessages: {
        type: Boolean,
    },
    gamificationChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    gamificationMultiplier: {
        type: Number,
    },
    gambling: {
        type: Boolean,
    },
    gamblingMultiplier: {
        type: Number,
    },
    infractionsTimeoutThreshold: {
        type: Number,
    },
    infractionsKickThreshold: {
        type: Number,
    },
    infractionsBanThreshold: {
        type: Number,
    },
    inviteFilter: {
        type: Boolean,
    },
    inviteFilterWarnings: {
        type: Boolean,
    },
    inviteFilterExemptions: {
        type: [ String ],
    },
    linkFilter: {
        type: Boolean,
    },
    linkFilterWarnings: {
        type: Boolean,
    },
    linkFilterExemptions: {
        type: [ String ],
    },
    messageFilter: {
        type: Boolean,
    },
    messageFilterWarnings: {
        type: Boolean,
    },
    messageFilterPatterns: {
        type: [ String ],
    },
    mentionSpamThreshold: {
        type: Number,
    },
    starboardChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    starboardThreshold: {
        type: Number,
    },
    moderationLogChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    serverLogChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    serverLogContent: {
        type: Boolean,
    },
    suggestionsChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    reportsChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    streamerRole: {
        type: String,
        unique: true,
        sparse: true,
    },
    autoThreadChannels: {
        type: [ String ],
    },
    votingChannels: {
        type: [ String ],
    },
    twitchNotificationChannel: {
        type: String,
        unique: true,
        sparse: true,
    },
    twitchNotificationMessage: {
        type: String,
    },
    twitchNotificationUsers: {
        type: [ String ],
    },
    voiceSessionCategories: {
        type: [ String ],
    },
    voiceSessionUserLimit: {
        type: Number,
    },
    boosts: {
        type: Number,
    },
    verifiedRole: {
        type: String,
        unique: true,
        sparse: true,
    },
}));
