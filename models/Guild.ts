/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as mongoose from "mongoose";

export interface Guild {
    _id: string;
    id?: string;
    disabled?: boolean;
    prefixes?: string[];
    language?: string;
    greeting?: {
        channelId: string;
        message?: Record<string, unknown>;
        timeout?: number;
    };
    farewell?: {
        channelId: string;
        message?: Record<string, unknown>;
        timeout?: number;
    };
    music?: {
        enabled: boolean;
        textChannelId?: string;
        voiceChannelId?: string;
        roleId?: string;
        autoPlay?: boolean;
        keepAlive?: boolean;
    };
    gamification?: {
        enabled: boolean;
        messages?: boolean;
        multiplier?: number;
    };
    chat?: boolean;
    streamerRoleId?: string;
    serverLogChannelId?: string;
    moderationLogChannelId?: string;
    starboardChannelId?: string;
    announcementsChannelId?: string;
    reportsChannelId?: string;
    suggestionsChannelId?: string;
    moderationCaseCount?: number;
    reactionAnnouncements?: boolean;
    reactionPinning?: boolean;
    referralsChannel?: string;
    filters?: {
        inviteFilter?: {
            enabled: boolean;
            whitelist?: string[];
            infraction?: boolean;
        };
        linkFilter?: {
            enabled: boolean;
            whitelist?: string[];
            infraction?: boolean;
        };
        messageFilter?: {
            enabled: boolean;
            patterns: string[];
            infraction?: boolean;
        };
    };
    mentionSpam?: {
        roles?: boolean;
        users?: boolean;
        threshold?: number;
    };
    infractions?: {
        kickThreshold: number;
        banThreshold: number;
    };
    gambling?: {
        enabled: boolean;
        multiplier?: number;
    };
    streamers?: {
        twitch?: {
            channelId?: string;
            users: string[];
        };
    };
    voiceSessions: {
        categories?: string[];
        userLimit?: number;
    };
    disabledCommands?: string[];
    membersOnly?: boolean;
    boosts?: number;
    verifiedRoleId?: string;
}

export default mongoose.model<Guild & mongoose.Document>("Guild", new mongoose.Schema<Guild>({
    _id: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
    },
    prefixes: {
        type: [ String ],
    },
    language: {
        type: String,
    },
    greeting: {
        type: {
            channelId: {
                type: String,
                unique: true,
                sparse: true,
            },
            message: {
                type: Object,
                trim: true,
            },
            timeout: {
                type: Number,
            },
        },
    },
    farewell: {
        type: {
            channelId: {
                type: String,
                unique: true,
                sparse: true,
            },
            message: {
                type: Object,
                trim: true,
            },
            timeout: {
                type: Number,
            },
        },
    },
    music: {
        type: {
            enabled: {
                type: Boolean,
            },
            textChannelId: {
                type: String,
                unique: true,
                sparse: true,
            },
            voiceChannelId: {
                type: String,
                unique: true,
                sparse: true,
            },
            roleId: {
                type: String,
                unique: true,
                sparse: true,
            },
            autoPlay: {
                type: Boolean,
            },
            keepAlive: {
                type: Boolean,
            },
        },
    },
    gamification: {
        type: {
            enabled: {
                type: Boolean,
            },
            messages: {
                type: Boolean,
            },
            multiplier: {
                type: Number,
            },
        },
    },
    chat: {
        type: Boolean,
    },
    streamerRoleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    serverLogChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    moderationLogChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    starboardChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    announcementsChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    reportsChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    suggestionsChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
    moderationCaseCount: {
        type: Number,
    },
    reactionAnnouncements: {
        type: Boolean,
    },
    reactionPinning: {
        type: Boolean,
    },
    referralsChannel: {
        type: String,
    },
    filters: {
        type: {
            inviteFilter: {
                type: {
                    enabled: {
                        type: Boolean,
                    },
                    whitelist: {
                        type: [ String ],
                    },
                    infraction: {
                        type: Boolean,
                    },
                },
            },
            linkFilter: {
                type: {
                    enabled: {
                        type: Boolean,
                    },
                    whitelist: {
                        type: [ String ],
                    },
                    infraction: {
                        type: Boolean,
                    },
                },
            },
            messageFilter: {
                type: {
                    enabled: {
                        type: Boolean,
                    },
                    patterns: {
                        type: [ String ],
                    },
                    infraction: {
                        type: Boolean,
                    },
                },
            },
        }
    },
    mentionSpam: {
        type: {
            roles: {
                type: Boolean,
            },
            users: {
                type: Boolean,
            },
            threshold: {
                type: Number,
            },
        },
    },
    infractions: {
        type: {
            kickThreshold: {
                type: Number,
            },
            banThreshold: {
                type: Number,
            },
        },
    },
    gambling: {
        type: {
            enabled: {
                type: Boolean,
            },
            multiplier: {
                type: Number,
            },
        },
    },
    streamers: {
        type: {
            twitch: {
                type: {
                    channelId: {
                        type: String,
                    },
                    users: {
                        type: [ String ],
                    },
                },
            },
        },
    },
    voiceSessions: {
        type: {
            categories: {
                type: [ String ],
            },
            userLimit: {
                type: Number,
            },
        },
    },
    disabledCommands: {
        type: [ String ],
    },
    membersOnly: {
        type: Boolean,
    },
    boosts: {
        type: Number,
    },
    verifiedRoleId: {
        type: String,
    },
}));
