/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, Listener } from "@bastion/tesseract";
import { DMChannel, GuildChannel } from "discord.js";

import Guild = require("../structures/Guild");

export = class ChannelCreateListener extends Listener {
    constructor() {
        super("channelCreate", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (channel: DMChannel | GuildChannel): Promise<void> => {
        if (channel instanceof GuildChannel) {
            const guild = channel.guild as Guild;

            guild.createLog({
                event: channel.type + "ChannelCreate",
                fields: [
                    {
                        name: "Channel Name",
                        value: channel.name,
                        inline: true,
                    },
                    {
                        name: "Channel ID",
                        value: channel.id,
                        inline: true,
                    },
                    {
                        name: "Channel Category",
                        value: channel.parent ? channel.parent.name : "-",
                        inline: true,
                    },
                ],
                timestamp: channel.createdTimestamp,
            });
        }
    }
}
