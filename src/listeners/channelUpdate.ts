/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { resolveType } from "../utils/channels.js";
import { logGuildEvent } from "../utils/guilds.js";

class ChannelUpdateListener extends Listener<"channelUpdate"> {
    constructor() {
        super("channelUpdate");
    }

    public async exec(oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel): Promise<void> {
        if (oldChannel.isDMBased() || newChannel.isDMBased()) return;

        if (oldChannel.name === newChannel.name && oldChannel.parentId === newChannel.parentId) return;

        await logGuildEvent(newChannel.guild, {
            title: `${ resolveType(newChannel.type) } Channel Updated`,
            url: newChannel.url,
            fields: [
                {
                    name: "Name",
                    value: oldChannel.name === newChannel.name ? newChannel.name : `${ oldChannel.name } ➜ **${ newChannel.name }**`,
                    inline: true,
                },
                {
                    name: "ID",
                    value: newChannel.id,
                    inline: true,
                },
                {
                    name: "Category",
                    value: oldChannel.parentId === newChannel.parentId ? newChannel.parent?.name || "-" : !oldChannel.parent?.name ? newChannel.parent.name : !newChannel.parent?.name ? "-" : `${ oldChannel.parent.name } ➜ **${ newChannel.parent.name }**`,
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
        });
    }
}

export { ChannelUpdateListener as Listener };
