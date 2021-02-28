/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";
import { User } from "discord.js";

import Guild = require("../structures/Guild");

export = class GuildBanRemoveListener extends Listener {
    constructor() {
        super("guildBanRemove", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (guild: Guild, user: User): Promise<void> => {
        guild.createLog({
            event: "guildBanRemove",
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
            ],
        });
    }
}
