/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import * as omnic from "../../utils/omnic";

export = class GarfieldCommand extends Command {
    constructor() {
        super("garfield", {
            description: "It allows you to see the latest Garfield comic strip.",
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
        // fetch the comic strip
        const response = await omnic.makeRequest("/comics/garfield/latest");
        const garfield = await response.json();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Garfield",
                    url: garfield.url,
                },
                fields: [
                    {
                        name: "Publication Date",
                        value: new Date().toDateString(),
                        inline: true,
                    },
                ],
                image: {
                    url: garfield.img,
                },
                footer: {
                    text: "Powered by Garfield",
                },
            },
        });
    }
}
