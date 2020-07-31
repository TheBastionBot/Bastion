/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class ReloadSettings extends Command {
    constructor() {
        super("reloadSettings", {
            description: "It allows you to reload Bastion's settings without needing to restart Bastion.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // reload settings
        this.client.shard.broadcastEval("this.loadSettings()");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "settingsReload", message.author.tag),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
