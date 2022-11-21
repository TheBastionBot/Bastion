/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { NonThreadGuildBasedChannel } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { resolveType } from "../utils/channels";
import { logGuildEvent } from "../utils/guilds";

class ChannelCreateListener extends Listener<"channelCreate"> {
    constructor() {
        super("channelCreate");
    }

    public async exec(channel: NonThreadGuildBasedChannel): Promise<void> {
        if (channel.isDMBased()) return;

        await logGuildEvent(channel.guild, {
            title: `${ resolveType(channel.type) } Channel Created`,
            url: channel.url,
            fields: [
                {
                    name: "Name",
                    value: channel.name,
                    inline: true,
                },
                {
                    name: "ID",
                    value: channel.id,
                    inline: true,
                },
                {
                    name: "Category",
                    value: channel.parent?.name || "-",
                    inline: true,
                },
            ],
            timestamp: channel.createdAt.toISOString(),
        });
    }
}

export = ChannelCreateListener;
