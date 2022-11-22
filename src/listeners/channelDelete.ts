/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { NonThreadGuildBasedChannel } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds";
import { resolveType } from "../utils/channels";

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
    }
}

export = ChannelDeleteListener;
