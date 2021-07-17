/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

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
        // get today's date
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Garfield",
                    url: "https://garfield.com/comic",
                },
                fields: [
                    {
                        name: "Publication Date",
                        value: new Date().toDateString(),
                        inline: true,
                    },
                ],
                image: {
                    url: "https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/" + year + "/" + year +  "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + ".gif",
                },
                footer: {
                    text: "Powered by Garfield",
                },
            },
        });
    }
}
