/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Client } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild";

class ReadyListener extends Listener<"ready"> {
    constructor() {
        super("ready");
    }

    public async exec(client: Client<true>): Promise<void> {
        // get all the guild documents
        const guildDocuments = await GuildModel.find({}, "id").catch(Logger.error);

        if (guildDocuments) {
            // get all the guilds that don't have a document
            const newGuilds = client.guilds.cache
            .map(g => ({ _id: g.id }))
            .filter(g => !guildDocuments.some(doc => doc._id === g._id));

            // create the documents for the new guilds
            if (newGuilds.length) {
                await GuildModel.insertMany(newGuilds as GuildDocument[], { ordered: false })
                .catch(Logger.error);
            }
        }
    }
}

export = ReadyListener;
