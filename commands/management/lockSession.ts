/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class LockSessionCommand extends Command {
    constructor() {
        super("lockSession", {
            description: "It allows you lock the Voice Session channel that you're currently in so that anyone else can't join unless they're invited.",
            triggers: [],
            arguments: {
                alias: {
                    remove: [ "r" ],
                },
                boolean: [ "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "lockSession",
            ],
        });
    }

    exec = async (message: Message): Promise<void> => {
        if (message.member.voice.channel && message.member.voice.channel.parent && message.member.voice.channel.parentID && (message.guild as BastionGuild).document.voiceSessions && (message.guild as BastionGuild).document.voiceSessions.categories && (message.guild as BastionGuild).document.voiceSessions.categories.includes(message.member.voice.channel.parentID) && !message.member.voice.channel.name.startsWith("➕ New")) {
            await message.member.voice.channel.updateOverwrite(message.guild.id, {
                CONNECT: false,
            }, "Locking Voice Session");

            await message.react("✅");
        }
    }
}
