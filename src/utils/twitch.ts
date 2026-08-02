/*!
 * @author TRACTION (iamtraction)
 * @copyright 2025
 */
import { IncomingHttpHeaders } from "node:http";
import { Dispatcher } from "undici";

import { refreshToken } from "./tokenRefresh.js";

import type Settings from "./settings.js";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

/** The credentials Twitch expects on every request. */
export const twitchHeaders = (settings: Settings): IncomingHttpHeaders => ({
    "client-id": settings?.get("twitch")?.clientId,
    "authorization": "Bearer " + settings?.get("twitch")?.accessToken,
});

interface TwitchConfig {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
}

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export const refreshTwitchToken = async (settings: Settings): Promise<boolean> => {
    return refreshToken<TwitchConfig, TwitchTokenResponse>(settings, {
        id: "twitch",
        tokenUrl: TWITCH_TOKEN_URL,
        tokenField: "accessToken",
        validateConfig: (config): config is TwitchConfig => {
            return !!config?.clientId && !!config?.clientSecret;
        },
        buildRequest: (config): Omit<Dispatcher.RequestOptions, "origin" | "path"> => {
            const params = new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: "client_credentials",
            });

            return {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            };
        },
        parseResponse: (response): string => {
            const tokenData = response as TwitchTokenResponse;
            return tokenData.access_token;
        },
    });
};
