/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { IncomingHttpHeaders } from "http";
import { UrlObject } from "url";
import { Dispatcher, request } from "undici";

export const get = (url: string | URL | UrlObject, headers?: IncomingHttpHeaders | string[], options?: { dispatcher?: Dispatcher; } & Omit<Dispatcher.RequestOptions, "origin" | "path" | "method"> & Partial<Pick<Dispatcher.RequestOptions, "method">>) => {
    return request(url, {
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "user-agent": "Bastion (The Bastion Bot Project; https://bastion.traction.one)",
            ...headers,
        },
        ...options,
        method: "GET",
    });
};

export const post = (url: string | URL | UrlObject, headers?: IncomingHttpHeaders | string[], options?: { dispatcher?: Dispatcher; } & Omit<Dispatcher.RequestOptions, "origin" | "path" | "method"> & Partial<Pick<Dispatcher.RequestOptions, "method">>, body?: Record<string, unknown>) => {
    return request(url, {
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "user-agent": "Bastion (The Bastion Bot Project; https://bastion.traction.one)",
            ...headers,
        },
        ...options,
        method: "POST",
        body: JSON.stringify(body),
    });
};
