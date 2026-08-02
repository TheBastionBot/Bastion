/*!
 * @author TRACTION (iamtraction)
 * @copyright 2025
 */
import { IncomingHttpHeaders } from "node:http";
import { Logger } from "@bastion/tesseract";
import { Dispatcher, request } from "undici";

import type Settings from "./settings.js";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const RENEW_MARGIN = 36e5;

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
}

interface TwitchToken {
    value: string;
    renewAt: number;
    clientId: string;
    clientSecret: string;
}

/** The token this process holds, and the credentials it was issued against. */
let token: TwitchToken = null;
/** A token already being asked for, so everything asking at once waits for one instead of several. */
let minting: Promise<TwitchToken> = null;

const mint = async (settings: Settings): Promise<TwitchToken> => {
    const config = settings?.get("twitch");

    if (!config?.clientId || !config?.clientSecret) {
        throw new Error("Twitch needs both a client ID and a client secret in settings.");
    }

    const response = await request(TWITCH_TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "client_credentials",
        }).toString(),
    });

    if (response.statusCode !== 200) {
        throw new Error(`Twitch token request failed: ${ response.statusCode } ${ await response.body.text() }`);
    }

    const issued = await response.body.json() as TwitchTokenResponse;

    // defaulting the lifetime would make the token read as already spent, and re-mint on every call
    if (!issued?.access_token || !(issued.expires_in > 0)) {
        throw new Error("Twitch returned a token without an expiry.");
    }

    const lifetime = issued.expires_in * 1e3;

    token = {
        value: issued.access_token,
        renewAt: Date.now() + lifetime - Math.min(RENEW_MARGIN, lifetime / 2),
        clientId: config.clientId,
        clientSecret: config.clientSecret,
    };

    Logger.info(`Twitch issued an application token, good for ${ Math.round(issued.expires_in / 864e2) } days.`);

    return token;
};

/** The cached token, minted or renewed as needed. */
const twitchToken = async (settings: Settings): Promise<TwitchToken> => {
    const config = settings?.get("twitch");

    // a token outlives the credentials it was issued against, so rotating those has to retire it
    if (token?.clientId === config?.clientId && token?.clientSecret === config?.clientSecret
        && token?.renewAt > Date.now()) return token;

    minting ??= mint(settings).finally(() => { minting = null; });

    return minting;
};

const authorize = (issued: TwitchToken): IncomingHttpHeaders => ({
    "client-id": issued.clientId,
    "authorization": "Bearer " + issued.value,
});

/** Sends a request with Twitch's credentials, retrying once with a fresh token if refused. */
export const twitchRequest = async (settings: Settings, send: (headers: IncomingHttpHeaders) => Promise<Dispatcher.ResponseData>): Promise<Dispatcher.ResponseData> => {
    const used = await twitchToken(settings);
    const response = await send(authorize(used));

    if (response.statusCode !== 401) return response;

    Logger.error(`Twitch refused the token: ${ await response.body.text() }`);

    // retire only the token that was refused
    if (token?.value === used.value) token = null;

    return send(authorize(await twitchToken(settings)));
};
