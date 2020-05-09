/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as omnic from "../../utils/omnic";

export = class PatronsCommand extends Command {
    constructor() {
        super("patrons", {
            description: "It allows you to see our Patrons, the amazing people who support the development of The Bastion Bot Project.",
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
        // fetch patrons
        const response = await omnic.makeRequest("/patreon/patrons");
        const patrons: { full_name: string; patron_status: string }[] = await response.json();

        // acknowledge
        await message.channel.send({
            embed: {
                color: constants.COLORS.PATREON,
                author: {
                    name: this.client.locale.getConstant("bastion.project"),
                    iconURL: this.client.locale.getConstant("bastion.project.url") + ".png",
                },
                title: "Patrons",
                url: this.client.locale.getConstant("bastion.website") + "/donate",
                description: "These are the amazing people who continuously support us, by being our patron, on Patreon.",
                thumbnail: {
                    url: "https://c5.patreon.com/external/logo/guidelines/wordmark_on_navy.jpg",
                },
                fields: [
                    {
                        name: "Active Patrons",
                        value: patrons.filter(p => p.patron_status === "active_patron").map(p => p.full_name || "Anonymous").join(", ")
                    },
                    {
                        name: "Former Patrons",
                        value: patrons.filter(p => p.patron_status === "former_patron").map(p => p.full_name || "Anonymous").join(", ")
                    },
                ],
                footer: {
                    text: "You can be one of them too!",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
