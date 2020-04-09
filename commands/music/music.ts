/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");


export = class Music extends Command {
    constructor() {
        super("music", {
            description: "",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: true,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        const status = guild.document.music && guild.document.music.enabled;

        // Toggle music in the server
        guild.document.music = {
            ...guild.document.music,
            enabled: !status,
        };

        guild.document.save();

        await message.channel.send({
            embed: {
                color: status ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                description: this.client.locale.getString("en_us", "info", status ? "musicDisable" : "musicEnable", message.author.tag),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
