/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Guild } from "discord.js";

import { BastionCredentials } from "../typings/settings";

export = class GuildDeleteListener extends Listener {
    constructor() {
        super("guildDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild): Promise<void> => {
        const credentials = (this.client.credentials as BastionCredentials);

        // log guild info when leaving a guild
        if (credentials.bastion && credentials.bastion.webhookID && credentials.bastion.webhookToken) {
            const bastionHook = await this.client.fetchWebhook(credentials.bastion.webhookID, credentials.bastion.webhookToken);

            bastionHook.send({
                username: "Bastion",
                embeds: [
                    {
                        color: Constants.COLORS.RED,
                        description: "I have left the " + guild.name + " server.",
                        fields: [
                            {
                                name: "Server Owner",
                                value: guild.owner.user.tag + " / " + guild.owner.user.id,
                            },
                        ],
                        footer: {
                            text: guild.id
                        },
                        thumbnail: {
                            url: guild.icon ? guild.iconURL({
                                dynamic: true,
                                size: 512,
                            }) : "",
                        },
                        timestamp: new Date(),
                    }
                ],
            }).catch(() => {
                // this error can be ignored
            });
        }
    }
}
