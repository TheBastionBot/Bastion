/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Guild } from "discord.js";
import { Client, Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild";
import { COLORS } from "../utils/constants";
import { log as bastionLog } from "../utils/webhooks";

class GuildCreateListener extends Listener<"guildCreate"> {
    constructor() {
        super("guildCreate");
    }

    public async exec(guild: Guild): Promise<void> {
        // create the guild document
        GuildModel.findByIdAndUpdate(guild.id, { _id: guild.id }, { upsert: true })
        .catch(Logger.error);

        // bastion log
        bastionLog(guild.client as Client, {
            color: COLORS.GREEN,
            description: `I have joined the server **${ guild.name }**.`,
            fields: [
                {
                    name: "ID",
                    value: guild.id || "-",
                    inline: true,
                },
                {
                    name: "Owner",
                    value: guild.ownerId || "-",
                    inline: true,
                },
            ],
            thumbnail: {
                url: guild.iconURL(),
            },
            footer: {
                text: `Shard ${ guild.shardId }`,
            },
            timestamp: guild.members.me.joinedAt.toISOString(),
        }).catch(Logger.error);
    }
}

export = GuildCreateListener;
