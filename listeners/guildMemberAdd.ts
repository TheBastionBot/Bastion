/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember } from "discord.js";

import Guild = require("../structures/Guild");

export = class GuildMemberAddListener extends Listener {
    constructor() {
        super("guildMemberAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (member: GuildMember): Promise<void> => {
        const guild = member.guild as Guild;

        guild.createLog({
            event: "guildMemberAdd",
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
                    name: "Joined Discord",
                    value: member.user.createdAt.toUTCString(),
                    inline: true,
                },
            ],
            timestamp: member.joinedTimestamp,
        });
    }
}
