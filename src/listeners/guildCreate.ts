/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Guild } from "discord.js";
import { Client, Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import { COLORS } from "../utils/constants.js";
import { log as bastionLog } from "../utils/webhooks.js";

class GuildCreateListener extends Listener<"guildCreate"> {
    constructor() {
        super("guildCreate");
    }

    public async exec(guild: Guild): Promise<void> {
        // create the guild document
        GuildModel.findByIdAndUpdate(guild.id, {}, { upsert: true })
            .catch(Logger.error);

        // bastion log
        bastionLog(guild.client as Client, {
            color: COLORS.GREEN,
            description: (guild.client as Client).locales.getText(guild.preferredLocale, "guildJoined", { guild: guild.name }),
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

export { GuildCreateListener as Listener };
