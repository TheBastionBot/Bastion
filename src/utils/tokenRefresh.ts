/*!
 * @author TRACTION (iamtraction)
 * @copyright 2025
 */
import { Logger } from "@bastion/tesseract";
import { request, type Dispatcher } from "undici";

import type Settings from "./settings.js";
import type { bastion } from "../types.js";

const locks = new Map<string, boolean>();
interface TokenRefreshConfig<TConfig = unknown> {
    id: keyof bastion.Settings;
    tokenUrl: string;
    tokenField: keyof TConfig;
    validateConfig: (config: TConfig | undefined) => config is TConfig;
    buildRequest: (config: TConfig) => Omit<Dispatcher.RequestOptions, "origin" | "path">;
    parseResponse: (response: unknown) => string;
}

export const refreshToken = async <TConfig = unknown, TResponse = unknown>(
    settings: Settings,
    config: TokenRefreshConfig<TConfig>
): Promise<boolean> => {
    if (locks.get(config.id)) return false;

    locks.set(config.id, true);

    try {
        const serviceConfig = settings.get(config.id) as TConfig | undefined;

        if (!config.validateConfig(serviceConfig)) {
            Logger.error(`[TOKEN REFRESH] ${ config.id } settings is missing required fields.`);
            return false;
        }

        const requestOptions = config.buildRequest(serviceConfig);

        const response = await request(config.tokenUrl, requestOptions);

        if (response.statusCode !== 200) {
            const error = await response.body.json().catch(() => ({ message: "Unknown error" }));
            Logger.error(`[TOKEN REFRESH] ${ config.id } token refresh failed: ${ JSON.stringify(error) }`);
            return false;
        }

        const responseData = await response.body.json() as TResponse;
        const newToken = config.parseResponse(responseData);

        const updatedConfig = {
            ...serviceConfig,
            [config.tokenField]: newToken,
        };

        settings.set(config.id, updatedConfig as never);

        Logger.info(`${ config.id } token refreshed successfully`);
        return true;
    } catch (error) {
        Logger.error(`[TOKEN REFRESH] ${ config.id } token refresh errored: ${ error }`);
        return false;
    } finally {
        locks.set(config.id, false);
    }
};
