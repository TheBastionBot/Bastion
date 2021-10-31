/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as requests from "../../utils/requests";
import { BastionCredentials } from "../../typings/settings";

export = class APODCommand extends Command {
    constructor() {
        super("apod", {
            description: "It allows you to discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.",
            triggers: [ "astronomyPictureOfTheDay" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const response = await requests.get("https://api.nasa.gov/planetary/apod?api_key=" + (this.client.credentials as BastionCredentials).nasaApiKey);

        const apod: {
            copyright: string;
            date: string;
            explanation: string;
            hdurl: string;
            media_type: string;
            service_version: string;
            title: string;
            url: string;
        } = await response.json();

        const today = new Date();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Astronomy Picture of the Day",
                    url: "https://apod.nasa.gov/apod/ap" + (
                        (today.getUTCFullYear() - 2000).toString()
                        + (today.getUTCMonth() > 8 ? (today.getUTCMonth() + 1).toString() : ("0" + (today.getUTCMonth() + 1).toString()))
                        + (today.getUTCDate() > 9 ? today.getUTCDate().toString() : ("0" + today.getUTCDate().toString()))
                    ) + ".html",
                },
                title: apod.title,
                description: apod.explanation,
                image: {
                    url: apod.hdurl || apod.url,
                },
                footer: {
                    text: apod.copyright ? "©️" + apod.copyright : "Powered by NASA",
                },
                timestamp: new Date(apod.date),
            },
        });
    };
}
