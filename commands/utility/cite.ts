/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";

export = class CiteCommand extends Command {
    constructor() {
        super("cite", {
            description: "It allows you to cite a message from any channel in the server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "cite MESSAGE_ID",
                "cite MESSAGE_ID --channel CHANNEL_ID",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        // identify channel
        const channel = (argv.channel ? message.guild.channels.cache.get(argv.channel) : message.channel) as TextChannel;
        if (!channel || !("messages" in channel)) throw new Error("CHANNEL_NOT_FOUND");

        // identify message
        const targetMessage = await channel.messages.fetch(argv._.join(""));
        if (!targetMessage) throw new Error("MESSAGE_NOT_FOUND");

        // check if message has content
        if (!targetMessage.content) throw new Error("NO_MESSAGE_CONTENT");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: targetMessage.author.tag,
                    iconURL: targetMessage.author.displayAvatarURL({
                        dynamic: true,
                        size: 64,
                    }),
                },
                title: "#" + channel.name,
                description: targetMessage.content,
                fields: [
                    {
                        name: "Source",
                        value: "[Click here to Jump to the Message.](" + targetMessage.url  + ")",
                        inline: true,
                    },
                ],
                footer: {
                    text: targetMessage.id,
                },
            },
        });
    }
}
