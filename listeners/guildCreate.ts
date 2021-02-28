/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";
import { Guild } from "discord.js";

import GuildModel from "../models/Guild";
import * as constants from "../utils/constants";
import { BastionCredentials } from "../typings/settings";
import BastionGuild = require("../structures/Guild");

export = class GuildCreateListener extends Listener {
    constructor() {
        super("guildCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild): Promise<void> => {
        // create the guild instance in datastore
        GuildModel.findByIdAndUpdate(guild.id, { _id: guild.id }, { upsert: true }).catch(Logger.error);

        // cache invite data
        // TODO: add public bot support (with premium membership)
        if (!constants.isPublicBastion(this.client.user)) {
            // fetch guild invites
            const invites = await guild.fetchInvites().catch(() => {
                // this error can be ignored
            });
            if (invites) {
                // store invite uses in cache
                for (const invite of invites.values()) {
                    (guild as BastionGuild).invites[invite.code] = invite.uses || 0;
                }
            }
        }


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
