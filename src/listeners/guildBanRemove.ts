/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildBan } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds.js";

class GuildBanRemoveListener extends Listener<"guildBanRemove"> {
    constructor() {
        super("guildBanRemove");
    }

    public async exec(ban: GuildBan): Promise<void> {
        await logGuildEvent(ban.guild, {
            title: "User Unbanned",
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

export { GuildBanRemoveListener as Listener };
