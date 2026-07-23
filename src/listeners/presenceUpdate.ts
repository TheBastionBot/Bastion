/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ActivityType, Guild, Presence } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";

class PresenceUpdateListener extends Listener<"presenceUpdate"> {
    // streaming members per guild
    private readonly streamers = new WeakMap<Guild, Set<string>>();

    constructor() {
        super("presenceUpdate");
    }

    public async exec(_: Presence, newPresence: Presence): Promise<void> {
        if (!newPresence?.guild || !newPresence.userId) return;

        const streaming = newPresence.activities.some(a => a.type === ActivityType.Streaming);
        const streamers = this.streamers.get(newPresence.guild);
        const wasStreaming = streamers?.has(newPresence.userId) ?? false;

        // check for change in streaming state
        if (streaming === wasStreaming) return;

        if (streaming) {
            // check whether member has enough roles
            if (!(newPresence.member?.roles.cache.size > 1)) return;

            if (streamers) streamers.add(newPresence.userId);
            else this.streamers.set(newPresence.guild, new Set([ newPresence.userId ]));
        } else {
            streamers?.delete(newPresence.userId);
        }

        // fetch guild document
        const guildDocument = await GuildModel.findById(newPresence.guild.id);

        // check whether the streamer role is set and still exists
        if (!newPresence.guild.roles.cache.has(guildDocument?.streamerRole)) return;

        // update streamer role by id -- no cached member required
        const memberRole = { user: newPresence.userId, role: guildDocument.streamerRole };
        if (streaming) {
            newPresence.guild.members.addRole(memberRole).catch(Logger.ignore);
        } else {
            newPresence.guild.members.removeRole(memberRole).catch(Logger.ignore);
        }
    }
}

export { PresenceUpdateListener as Listener };
