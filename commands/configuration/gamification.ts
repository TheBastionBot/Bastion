/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");


export = class Gamification extends Command {
    constructor() {
        super("gamification", {
            description: "It allows you to enable (or disable) gamification in the server. When enabled, users gain experience and level up in the server by participating in the server, competing against each other to climb the leaderboard.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the gamification status
        guild.document.gamification = {
            ...guild.document.gamification,
            enabled: !(guild.document.gamification && guild.document.gamification.enabled),
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.gamification.enabled ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString("en_us", "info", guild.document.gamification.enabled ? "gamificationEnable" : "gamificationDisable", message.author.tag),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
