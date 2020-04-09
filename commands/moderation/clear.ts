/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

export = class Clear extends Command {
    constructor() {
        super("clear", {
            description: "",
            triggers: [ "clean", "purge" ],
            arguments: {
                alias: {
                    limit: "l",
                    time: "t",
                    user: "u",
                },
                boolean: [ "bots", "pinned", "system" ],
                number: [ "limit", "time" ],
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_MESSAGES" ],
            userPermissions: [ "MANAGE_MESSAGES" ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // Fetch deletable messages
        let messages = await message.channel.messages.fetch({
            limit: argv.limit || 100,
            before: message.id,
        }, false);

        // Filter messages by user
        const user = this.client.resolver.resolveUser(argv.user);
        if (user) messages = messages.filter(m => m.author.id === user.id);
        else if (argv.user) messages = messages.filter(m => m.author.id === argv.user);

        // Filter messages from bots
        if (argv.bots) messages = messages.filter(m => m.author.bot);
        else if (argv.bots === false) messages = messages.filter(m => !m.author.bot);

        // Filter pinned messages
        if (argv.pinned) messages = messages.filter(m => m.pinned);
        else if (argv.pinned === false) messages = messages.filter(m => !m.pinned);

        // Filter system messages
        if (argv.system) messages = messages.filter(m => m.system);
        else if (argv.system === false) messages = messages.filter(m => !m.system);

        // Filter messages sent after the specified time
        if (argv.time) {
            messages = messages.filter(m => m.createdTimestamp >= message.createdTimestamp - (argv.time * 60 * 1000));
        }

        // Delete filtered messages
        const reason = argv._.join(" ") || "-";

        const clearedMessages = await message.channel.bulkDelete(messages, true);

        if (!clearedMessages.size) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    title: this.client.locale.getString("en_us", "errors", "notFound"),
                    description: this.client.locale.getString("en_us", "errors", "noDeletableMessages"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Acknowledgement
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: this.client.locale.getString("en_us", "info", "messageClear", message.author.tag, clearedMessages.size),
                fields: [
                    {
                        name: "Reason",
                        value: reason,
                    },
                ],
                footer: {
                    text: user.id,
                },
            },
        }).then(m => {
            if (message.deletable) message.delete({ reason: argv._raw }).catch(() => {
                // This error can be ignored.
            });
            m.delete({
                timeout: 10000,
                reason: `Cleared ${clearedMessages.size} messages`,
            }).catch(() => {
                // This error can be ignored.
            });
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
