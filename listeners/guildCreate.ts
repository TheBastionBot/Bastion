/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Guild } from "discord.js";

import GuildModel from "../models/Guild";
import { BastionCredentials } from "../typings/settings";

export = class GuildCreateListener extends Listener {
    constructor() {
        super("guildCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild): Promise<void> => {
        // create the guild instance in datastore
        await GuildModel.findByIdAndUpdate(guild.id, { _id: guild.id }, { upsert: true });


        const credentials = (this.client.credentials as BastionCredentials);

        // log guild info when joining a new guild
        if (credentials.bastion && credentials.bastion.webhookID && credentials.bastion.webhookToken) {
            const bastionHook = await this.client.fetchWebhook(credentials.bastion.webhookID, credentials.bastion.webhookToken);

            bastionHook.send({
                username: "Bastion",
                embeds: [
                    {
                        color: Constants.COLORS.GREEN,
                        description: "I have joined the " + guild.name + " server.",
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
