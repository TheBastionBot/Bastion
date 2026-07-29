/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { NonThreadGuildBasedChannel } from "discord.js";
import { Listener, Logger } from "@bastion/tesseract";

import GuildModel from "../models/Guild.js";
import { logGuildEvent, logModerationEvent } from "../utils/guilds.js";
import { resolveType } from "../utils/channels.js";

class ChannelDeleteListener extends Listener<"channelDelete"> {
    constructor() {
        super("channelDelete");
    }

    public async exec(channel: NonThreadGuildBasedChannel): Promise<void> {
        if (channel.isDMBased()) return;

        await logGuildEvent(channel.guild, {
            title: `${ resolveType(channel.type) } Channel Deleted`,
            fields: [
                {
                    name: "Name",
                    value: channel.name,
                    inline: true,
                },
                {
                    name: "Category",
                    value: channel.parent?.name || "-",
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
        });

        // clear the honeypot channel if it was the one deleted
        const result = await GuildModel.updateOne(
            { _id: channel.guild.id, honeypotChannel: channel.id },
            { $unset: { honeypotChannel: 1 } },
        );

        // if the honeypot channel was deleted, alert the moderation team
        if (result.modifiedCount) {
            logModerationEvent(channel.guild, {
                title: "Honeypot Channel Removed",
                description: "The honeypot channel was deleted, so spam bots are no longer being caught by it. Use `/config honeypot create` to set up a new one.",
            }).catch(Logger.ignore);
        }
    }
}

export { ChannelDeleteListener as Listener };
