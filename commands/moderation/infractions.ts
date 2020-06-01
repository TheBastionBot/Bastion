/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuildMember = require("../../structures/GuildMember");

export = class InfractionsCommand extends Command {
    constructor() {
        super("infractions", {
            description: "It allows you to list all your infractions.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // acknowledge
        await message.channel.send({
            embed: {
                color: (message.member as BastionGuildMember).document.infractions && (message.member as BastionGuildMember).document.infractions.length ? Constants.COLORS.ORANGE : Constants.COLORS.GREEN,
                author: {
                    name: message.author.tag,
                },
                title: "Infractions",
                description: (message.member as BastionGuildMember).document.infractions && (message.member as BastionGuildMember).document.infractions.length ? (message.member as BastionGuildMember).document.infractions.join("\n") : "You haven't caused any trouble, yet. Keep it up!",
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
