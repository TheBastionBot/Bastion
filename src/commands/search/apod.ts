/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ChatInputCommandInteraction } from "discord.js";
import { Client, Command } from "@bastion/tesseract";

import { bastion } from "../../types";
import * as requests from "../../utils/requests";

interface APOD {
    copyright: string;
    date: string;
    explanation: string;
    hdurl?: string;
    media_type: string;
    service_version: string;
    title: string;
    url: string;
}

class APODCommand extends Command {
    constructor() {
        super({
            name: "apod",
            description: "Displays the astronomy picture of the day from NASA.",
        });
    }

    public async exec(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        await interaction.deferReply();

        const { body } = await requests.get(`https://api.nasa.gov/planetary/apod?api_key=${ ((interaction.client as Client).settings as bastion.Settings)?.nasaApiKey }`);
        const apod: APOD = await body.json();

        await interaction.editReply(`[${ apod.title }](${ apod.hdurl || apod.url }) — ${ apod.explanation }`);
    }
}

export = APODCommand;
