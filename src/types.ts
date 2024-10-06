/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { tesseract } from "@bastion/tesseract/typings/types.js";

export namespace bastion {
    export interface Settings extends tesseract.Settings {
        musicActivity?: boolean;
        relayDirectMessages?: boolean | string;
        port?: number;
        auth?: string;
        coinMarketCapApiKey?: string;
        nasaApiKey?: string;
        openai?: {
            apiKey?: string;
            model?: string;
            maxTokens?: number;
        };
        gemini?: {
            apiKey?: string;
            model?: string;
            maxOutputTokens?: number;
        };
        openWeatherMapApiKey?: string;
        tmdbApiKey?: string;
        trackerNetworkApiKey?: string;
        twitch?: {
            clientId?: string;
            clientSecret?: string;
            accessToken?: string;
        };
        ubisoft?: {
            email?: string;
            password?: string;
        };
        wordnikApiKey?: string;
        bastion?: {
            webhookId?: string;
            webhookToken?: string;
        };
        patreon?: {
            accessToken?: string;
        };
    }
}

export namespace patreon {
    export interface UserSocialConnections {
        readonly discord: {
            readonly user_id: string;
        };
    }

    export interface EntityAttributes {
        readonly currently_entitled_amount_cents: number;
        readonly full_name: string;
        readonly is_follower: boolean;
        readonly last_charge_date: string | null;
        readonly last_charge_status: "Paid" | "Declined" | "Deleted" | "Pending" | "Refunded" | "Fraud" | "Other" | null;
        readonly lifetime_support_cents: number;
        readonly patron_status: "active_patron" | "declined_patron" | "former_patron" | null;
        readonly pledge_relationship_start: string | null;
        readonly will_pay_amount_cents: number;
        readonly image_url: string;
        readonly social_connections: UserSocialConnections;
    }

    export interface EntityRelationshipData {
        readonly id: string;
        readonly type: string;
    }

    export interface EntityRelationship {
        readonly data: EntityRelationshipData;
    }

    export interface EntityRelationships {
        readonly creator: EntityRelationship;
        readonly patron: EntityRelationship;
        readonly user: EntityRelationship;
    }

    export interface PatreonEntity {
        readonly attributes: EntityAttributes;
        readonly id: string;
        readonly relationships: EntityRelationships;
        readonly type: string;
    }

    export interface PatreonResponse {
        readonly data?: PatreonEntity[];
        readonly included?: PatreonEntity[];
        readonly links?: {
            readonly prev: string;
            readonly next: string;
        };
        readonly meta?: {
            readonly pagination: {
                readonly total: number;
            };
        };
    }

    export interface Patron extends EntityAttributes {
        discord_id?: UserSocialConnections["discord"]["user_id"];
        discord_tag?: string;
        discord_avatar?: string;
    }
}

export interface TwitchStream {
    readonly game_id: string;
    readonly id: string;
    readonly language: string;
    readonly pagination: string;
    readonly started_at: string;
    readonly tag_ids: string;
    readonly thumbnail_url: string;
    readonly title: string;
    readonly type: "live" | "";
    readonly user_id: string;
    readonly user_name: string;
    readonly viewer_count: number;
}
