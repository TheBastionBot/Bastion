/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { GuildMember } from "discord.js";

import Guild = require("../structures/Guild");

export = class GuildMemberUpdateListener extends Listener {
    constructor() {
        super("guildMemberUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldMember: GuildMember, newMember: GuildMember): Promise<void> => {
        if (oldMember.nickname === newMember.nickname) return;

        const guild = oldMember.guild as Guild;

        guild.createLog({
            event: "nickUpdate",
            fields: [
                {
                    name: "Member",
                    value: oldMember.user.tag,
                    inline: true,
                },
                {
                    name: "Member ID",
                    value: oldMember.id,
                    inline: true,
                },
                {
                    name: "Nickname",
                    value: newMember.nickname || "-",
                    inline: true,
                },
            ],
        });
    }
}
