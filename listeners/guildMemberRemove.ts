/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember } from "discord.js";

import Guild = require("../structures/Guild");

export = class GuildMemberRemoveListener extends Listener {
    constructor() {
        super("guildMemberRemove", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (member: GuildMember): Promise<void> => {
        const guild = member.guild as Guild;

        guild.createLog({
            event: "guildMemberRemove",
            fields: [
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true,
                },
                {
                    name: "Member ID",
                    value: member.id,
                    inline: true,
                },
                {
                    name: "Member Type",
                    value: member.user.bot ? "Bot" : "Human",
                    inline: true,
                },
                {
                    name: "Joined Server",
                    value: member.joinedAt.toUTCString(),
                    inline: true,
                },
            ],
        });
    }
}
