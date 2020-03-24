/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";

import GuildModel from "../models/Guild";

export = class ReadyListener extends Listener {
    constructor() {
        super("ready", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (): Promise<void> => {
        const guilds = await GuildModel.find({}, "id");

        // Add guilds to the database which added Bastion when it was offline.
        const knownGuilds = guilds.map(g => g._id);
        const newGuilds = this.client.guilds.cache
            .map(g => ({ _id: g.id}))
            .filter(g => !knownGuilds.includes(g));

        if (newGuilds.length) {
            await GuildModel.insertMany(newGuilds);
        }
    }
}
