/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { User } from "discord.js";

import Guild = require("../structures/Guild");

export = class GuildBanAddListener extends Listener {
    constructor() {
        super("guildBanAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild, user: User): Promise<void> => {
        const banInfo = await guild.fetchBan(user.id);

        guild.createLog({
            event: "guildBanAdd",
            fields: [
                {
                    name: "User",
                    value: user.tag,
                    inline: true,
                },
                {
                    name: "User ID",
                    value: user.id,
                    inline: true,
                },
                {
                    name: "Reason",
                    value: banInfo.reason,
                },
            ],
        });
    }
}
