/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as omnic from "../../utils/omnic";

export = class APODCommand extends Command {
    constructor() {
        super("apod", {
            description: "It allows you to discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.",
            triggers: [],
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
        const response = await omnic.makeRequest("/nasa/apod");
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
                        (today.getUTCFullYear() - 2000).toString() + (today.getUTCMonth() > 9 ? (today.getUTCMonth() + 1).toString() : ("0" + (today.getUTCMonth() + 1).toString())) + today.getUTCDate().toString()
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
    }
}
