/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { Presence } from "discord.js";

import GuildModel from "../models/Guild";

export = class PresenceListener extends Listener {
    constructor() {
        super("presenceUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (oldPresence: Presence, newPresence: Presence): Promise<void> => {
        if (!newPresence) return;
        if (!newPresence.guild) return;

        let streamingStatus: boolean;
        if ((!oldPresence || oldPresence.activities.every(a => a.type !== "STREAMING")) && newPresence.activities.some(a => a.type === "STREAMING")) {
            // started streaming
            streamingStatus = true;
        } else if (oldPresence && oldPresence.activities.some(a => a.type === "STREAMING") && newPresence.activities.every(a => a.type !== "STREAMING")) {
            // stopped streaming
            streamingStatus = false;
        } else return;

        // fetch member, if only partial data exists
        if (newPresence.member.partial) {
            await newPresence.member.fetch();
        }

        // check whether member has enough roles
        if (newPresence.member.roles.cache.size <= 2) return;

        // fetch guild document
        const guildDocument = await GuildModel.findById(newPresence.guild.id);

        // check whether streamer role is set and exist
        if (!guildDocument.streamerRoleId) return;
        if (!newPresence.guild.roles.cache.has(guildDocument.streamerRoleId)) return;

        // update streamer role
        if (streamingStatus) {
            newPresence.member.roles.add(guildDocument.streamerRoleId).catch(() => {
                // this error can be ignored
            });
        } else {
            newPresence.member.roles.remove(guildDocument.streamerRoleId).catch(() => {
                // this error can be ignored
            });
        }
    }
}
