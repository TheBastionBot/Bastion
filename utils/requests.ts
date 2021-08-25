/*!
 * @author TRACTION (iamtraction)
 * @copyright 2021 - Sankarsan Kampa
 */

import fetch, { RequestInit, Response } from "node-fetch";

export const get = (url: string, headers?: { [key: string]: string }, options?: RequestInit): Promise<Response> => {
    return fetch(url, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Ommic (The Bastion Bot Project; https://bastion.traction.one)",
            ...headers,
        },
        ...options,
    });
};

export const post = (url: string, headers?: { [key: string]: string }, options?: RequestInit, body?: Record<string, unknown>): Promise<Response> => {
    return fetch(url, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Ommic (The Bastion Bot Project; https://bastion.traction.one)",
            ...headers,
        },
        ...options,
        method: "POST",
        body: JSON.stringify(body),
    });
};
