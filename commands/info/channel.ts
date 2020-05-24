/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { GuildChannel, Message, TextChannel } from "discord.js";

import * as strings from "../../utils/strings";
import BastionGuild = require("../../structures/Guild");

export = class ChannelCommand extends Command {
    constructor() {
        super("channel", {
            description: "It allows you see the information of a channel.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "channel",
                "channel -- CHANNEL",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const identifier: string = argv._.join(" ");

        let channel: GuildChannel;

        // identify the channel
        if (identifier) {
            channel = this.client.resolver.resolveGuildChannel(message.guild, identifier);
        } else {
            channel = message.channel as GuildChannel;
        }

        if (!channel) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "channelNotFound"));


        // acknowledge
        message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: channel.name,
                },
                title: strings.toTitleCase(channel.type) + " Channel",
                description: "topic" in channel ? (channel as TextChannel).topic : null,
                fields: [
                    {
                        name: "Position",
                        value: channel.rawPosition.toString(),
                        inline: true,
                    },
                    {
                        name: "Category",
                        value: channel.parent ? channel.parent.name : "-",
                        inline: true,
                    },
                    {
                        name: "Members",
                        value: channel.members.size + " Members",
                        inline: true,
                    },
                    {
                        name: "Created",
                        value: channel.createdAt.toUTCString(),
                        inline: true,
                    },
                ],
                footer: {
                    text: (channel.permissionsLocked ? "Synced" : "Not Synced") + " • " + channel.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
