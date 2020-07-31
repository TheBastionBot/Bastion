/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class EmojiCommand extends Command {
    constructor() {
        super("emoji", {
            description: "It allows you see the information of an emoji.",
            triggers: [ "emojiInfo" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "emoji EMOJI",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        let identifier: string = argv._.join(" ");
        if (identifier.includes(":")) {
            identifier = identifier.split(":")[1];
        }

        // identify the emoji
        const emoji = message.guild.emojis.cache.has(identifier) ? message.guild.emojis.cache.get(identifier) : message.guild.emojis.cache.find(e => e.name === identifier);

        if (!emoji) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "emojiNotFound"));

        const author = await emoji.fetchAuthor().catch(() => {
            // this error can be ignored
        });

        // acknowledge
        message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: emoji.name,
                },
                title: (emoji.managed ? "Managed" : "") + " Emoji",
                fields: [
                    {
                        name: "Author",
                        value: author ? author.tag + " / " + author.id : "-",
                    },
                    {
                        name: "Created",
                        value: emoji.createdAt.toUTCString(),
                    },
                ],
                thumbnail: {
                    url: emoji.url,
                },
                footer: {
                    text: (emoji.animated ? "Animated • " : "") + emoji.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
