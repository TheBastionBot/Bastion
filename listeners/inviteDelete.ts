/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Invite } from "discord.js";

import Guild = require("../structures/Guild");

export = class InviteDeleteListener extends Listener {
    constructor() {
        super("inviteDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (invite: Invite): Promise<void> => {
        const guild = invite.guild as Guild;

        const fields = [
            {
                name: "Invite Code",
                value: invite.code,
                inline: true,
            },
            {
                name: "Invite Channel",
                value: invite.channel,
                inline: true,
            },
        ];

        if (invite.inviter) {
            fields.push({
                name: "Inviter",
                value: invite.inviter.tag,
                inline: true,
            });
        }

        if (invite.uses) {
            fields.push({
                name: "Uses",
                value: invite.uses + (invite.maxUses ? " / " + invite.maxUses : ""),
                inline: true,
            });
        }

        guild.createLog({
            event: "inviteDelete",
            fields,
            footer: invite.temporary ? "Temporary Membership" : undefined,
        });
    }
}
