/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { DMChannel, GuildChannel } from "discord.js";

import Guild = require("../structures/Guild");

export = class ChannelDeleteListener extends Listener {
    constructor() {
        super("channelDelete", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (channel: DMChannel | GuildChannel): Promise<void> => {
        if (channel instanceof GuildChannel) {
            const guild = channel.guild as Guild;

            guild.createLog({
                event: channel.type + "ChannelDelete",
                fields: [
                    {
                        name: "Channel Name",
                        value: channel.name,
                        inline: true,
                    },
                    {
                        name: "Channel Category",
                        value: channel.parent ? channel.parent.name : "-",
                        inline: true,
                    },
                    {
                        name: "Channel Category ID",
                        value: channel.parent ? channel.parent.id : "-",
                        inline: true,
                    },
                ],
            });
        }
    }
}
