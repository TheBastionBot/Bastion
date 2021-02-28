/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import fetch, { RequestInit as RequestOptions, Response } from "node-fetch";

export const BASE_PATH = "https://ex.traction.one/";

export const resolvePath = (path: string): string => BASE_PATH + (BASE_PATH.endsWith("/") ? path.replace(/^\//g, "") : path);

export const makeRequest = (path: string, options?: RequestOptions): Promise<Response> => {
    const requestOptions: RequestOptions = {
        method: "GET",
        headers: {
            "Accepts": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Bastion (Discord Bot; https://bastion.traction.one)",
        },
        ...options,
    };

    return fetch(resolvePath(path), requestOptions);
};
