/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { GuildTextBasedChannel, Message, OmitPartialGroupDMChannel, PartialMessage, ReadonlyCollection } from "discord.js";
import { Listener } from "@bastion/tesseract";

import { logGuildEvent } from "../utils/guilds.js";

class MessageDeleteBulkListener extends Listener<"messageDeleteBulk"> {
    constructor() {
        super("messageDeleteBulk");
    }

    public async exec(messages: ReadonlyCollection<string, OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>>, channel: GuildTextBasedChannel): Promise<void> {
        await logGuildEvent(channel.guild, {
            title: "Messages Cleared",
            fields: [
                {
                    name: "Channel",
                    value: channel.name,
                    inline: true,
                },
                {
                    name: "Channel ID",
                    value: channel.id,
                    inline: true,
                },
                {
                    name: "Deleted Messages",
                    value: `${ messages.size } messages`,
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
        });
    }
}

export { MessageDeleteBulkListener as Listener };
