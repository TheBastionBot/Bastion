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
    // automod rules
    emailFilterRule?: string;
    inviteFilterRule?: string;
    linkFilterRule?: string;
    // protection
    protection?: number;
    honeypotChannel?: string;
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

export default mongoose.model<Guild>("Guild", new mongoose.Schema<Guild>({
    _id: {
        type: String,
        required: true,
    },
    chat: {
        type: Boolean,
    },
    greetingChannel: {
        type: String,
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
    },
    musicRole: {
        type: String,
    },
    gamification: {
        type: Boolean,
    },
    gamificationMessages: {
        type: Boolean,
    },
    gamificationChannel: {
        type: String,
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
    emailFilterRule: {
        type: String,
    },
    inviteFilterRule: {
        type: String,
    },
    linkFilterRule: {
        type: String,
    },
    protection: {
        type: Number,
    },
    honeypotChannel: {
        type: String,
    },
    starboardChannel: {
        type: String,
    },
    starboardThreshold: {
        type: Number,
    },
    moderationLogChannel: {
        type: String,
    },
    serverLogChannel: {
        type: String,
    },
    serverLogContent: {
        type: Boolean,
    },
    suggestionsChannel: {
        type: String,
    },
    reportsChannel: {
        type: String,
    },
    streamerRole: {
        type: String,
    },
    autoThreadChannels: {
        type: [ String ],
    },
    votingChannels: {
        type: [ String ],
    },
    twitchNotificationChannel: {
        type: String,
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
    },
}));
