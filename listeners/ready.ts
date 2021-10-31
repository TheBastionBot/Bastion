/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";

import ConfigModel from "../models/Config";
import GuildModel, { Guild } from "../models/Guild";
import * as constants from "../utils/constants";
import BastionGuild = require("../structures/Guild");

export = class ReadyListener extends Listener {
    constructor() {
        super("ready", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (): Promise<void> => {
        // Create Bastion's Config
        await ConfigModel.findByIdAndUpdate(this.client.user.id, {
            _id: this.client.user.id,
        }, {
            upsert: true,
        });


        // Add guilds to the database which added Bastion when it was offline.
        const guilds = await GuildModel.find({}, "id");

        const knownGuilds = guilds.map(g => g._id);
        const newGuilds = this.client.guilds.cache
            .map(g => ({ _id: g.id}))
            .filter(g => !knownGuilds.includes(g._id));

        if (newGuilds.length) {
            await GuildModel.insertMany(newGuilds as Guild[]);
        }

        // Cache invite data
        // TODO: add public bot support (with premium membership)
        if (!constants.isPublicBastion(this.client.user)) {
            for (const guild of this.client.guilds.cache.values()) {
                // fetch guild invites
                const invites = await guild.fetchInvites();
                // store invite uses in cache
                for (const invite of invites.values()) {
                    (guild as BastionGuild).invites[invite.code] = invite.uses || 0;
                }
            }
        }
    };
}
