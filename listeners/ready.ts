/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";

import ConfigModel from "../models/Config";
import GuildModel from "../models/Guild";

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
            await GuildModel.insertMany(newGuilds);
        }
    }
}
