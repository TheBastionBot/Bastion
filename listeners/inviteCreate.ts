/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Listener, Constants } from "@bastion/tesseract";
import { Invite } from "discord.js";

import Guild = require("../structures/Guild");
import * as constants from "../utils/constants";
import * as durations from "../utils/durations";

export = class InviteCreateListener extends Listener {
    constructor() {
        super("inviteCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (invite: Invite): Promise<void> => {
        const guild = invite.guild as Guild;

        // add new invite data to invite cache
        // TODO: add public bot support (with premium membership)
        if (!constants.isPublicBastion(this.client.user)) {
            (guild as Guild).invites[invite.code] = invite.uses || 0;
        }

        // server log
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

        if (invite.maxUses) {
            fields.push({
                name: "Max Uses",
                value: invite.maxUses.toString(),
                inline: true,
            });
        }

        if (invite.maxAge) {
            fields.push({
                name: "Expires",
                value: durations.humanize(durations.between(invite.maxAge * 1e3)),
                inline: true,
            });
        }

        guild.createLog({
            event: "inviteCreate",
            fields,
            footer: invite.temporary ? "Temporary Membership" : undefined,
            timestamp: invite.createdTimestamp,
        });
    }
}
