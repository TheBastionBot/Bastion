/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildBan } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds.js";

class GuildBanAddListener extends Listener<"guildBanAdd"> {
    constructor() {
        super("guildBanAdd");
    }

    public async exec(ban: GuildBan): Promise<void> {
        await logGuildEvent(ban.guild, {
            title: "User Banned",
            fields: [
                {
                    name: "User",
                    value: ban.user.tag,
                    inline: true,
                },
                {
                    name: "ID",
                    value: ban.user.id,
                    inline: true,
                },
                {
                    name: "Reason",
                    value: ban.reason || "-",
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
        });
    }
}

export { GuildBanAddListener as Listener };
