/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Guild } from "discord.js";
import { Client, Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import { COLORS } from "../utils/constants.js";
import { log as bastionLog } from "../utils/webhooks.js";

class GuildDeleteListener extends Listener<"guildDelete"> {
    constructor() {
        super("guildDelete");
    }

    public async exec(guild: Guild): Promise<void> {
        // delete the guild document
        await GuildModel.findByIdAndDelete(guild.id);

        // bastion log
        bastionLog(guild.client as Client, {
            color: COLORS.RED,
            description: (guild.client as Client).locales.getText(guild.preferredLocale, "guildLeft", { guild: guild.name }),
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
            timestamp: new Date().toISOString(),
        }).catch(Logger.error);
    }
}

export { GuildDeleteListener as Listener };
