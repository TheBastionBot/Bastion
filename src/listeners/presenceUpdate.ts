/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { ActivityType, Presence } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";

class PresenceUpdateListener extends Listener<"presenceUpdate"> {
    constructor() {
        super("presenceUpdate");
    }

    public async exec(oldPresence: Presence, newPresence: Presence): Promise<void> {
        if (!newPresence?.guild) return;

        // check whether member has enough roles
        if (newPresence?.member?.roles?.cache?.size > 1) {
            const wasStreaming = oldPresence?.activities.some(a => a.type === ActivityType.Streaming);
            const isStreaming = newPresence?.activities.some(a => a.type === ActivityType.Streaming);

            const streamingStatus = (!wasStreaming && isStreaming) ? true : (wasStreaming && !isStreaming) ? false : undefined;

            if (typeof streamingStatus === "boolean") {
                // fetch guild document
                const guildDocument = await GuildModel.findById(newPresence.guild.id);

                // check whether streamer role is set and exist
                if (newPresence.guild.roles.cache.has(guildDocument?.streamerRole)) {
                    // update streamer role
                    if (streamingStatus) {
                        newPresence.member.roles.add(guildDocument.streamerRole).catch(Logger.ignore);
                    } else {
                        newPresence.member.roles.remove(guildDocument.streamerRole).catch(Logger.ignore);
                    }
                }
            }
        }
    }
}

export { PresenceUpdateListener as Listener };
