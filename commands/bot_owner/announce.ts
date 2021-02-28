/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message, NewsChannel, TextChannel } from "discord.js";

import GuildModel from "../../models/Guild";
import * as errors from "../../utils/errors";

export = class Announce extends Command {
    constructor() {
        super("announce", {
            description: "It allows you to send announcements to the announcement channels in the servers where it has been set.",
            triggers: [],
            arguments: {
                array: [ "message", "title" ],
                string: [ "message", "title" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "announce --message MESSAGE",
                "announce --title TITLE --message MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const announcementTitle = argv.title && argv.title.join(" ");
        const announcementMessage = argv.message && argv.message.join(" ");

        // command syntax validation
        if (!announcementMessage) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const guilds = await GuildModel.find({ announcementsChannelId: { $exists: true } });

        for (const guild of guilds) {
            if (this.client.channels.cache.has(guild.announcementsChannelId)) {
                const announcementChannel = this.client.channels.cache.get(guild.announcementsChannelId) as TextChannel | NewsChannel;

                // announce
                announcementChannel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        title: announcementTitle,
                        description: announcementMessage,
                        footer: {
                            text: "📣 " + message.author.tag + " / " + message.author.id,
                        },
                    },
                }).catch(() => {
                    // this error can be ignored.
                });
            }
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                author: {
                    name: "Announced",
                },
                title: announcementTitle,
                description: announcementMessage,
                footer: {
                    text: "📣 " + message.author.tag + " / " + message.author.id,
                },
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
