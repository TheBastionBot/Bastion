/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Client } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild.js";

class ClientReadyListener extends Listener<"clientReady"> {
    constructor() {
        super("clientReady");
    }

    public async exec(client: Client<true>): Promise<void> {
        // get all the guild documents
        const guildDocuments = await GuildModel.find({}, "_id").lean().catch(Logger.error);

        if (guildDocuments) {
            const knownGuilds = new Set(guildDocuments.map(doc => doc._id));

            // get all the guilds that don't have a document
            const newGuilds = client.guilds.cache
                .filter(g => !knownGuilds.has(g.id))
                .map(g => ({ _id: g.id }));

            // create the documents for the new guilds
            if (newGuilds.length) {
                await GuildModel.insertMany(newGuilds as GuildDocument[], { ordered: false })
                    .catch(Logger.error);
            }
        }
    }
}

export { ClientReadyListener as Listener };
