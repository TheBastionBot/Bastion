/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { GuildChannel, Message, TextChannel } from "discord.js";

import confirmation from "../../utils/confirmation";
import * as errors from "../../utils/errors";
import * as numbers from "../../utils/numbers";
import BastionGuild = require("../../structures/Guild");

export = class ChannelsCommand extends Command {
    constructor() {
        super("channels", {
            description: "It allows you create, delete and update channels in the server.",
            triggers: [],
            arguments: {
                array: [ "create", "rename", "topic" ],
                boolean: [ "delete", "nsfw", "slowmode" ],
                number: [ "limit" ],
                string: [ "category", "create", "rename", "topic" ],
                coerce: {
                    type: (arg: string): string => [ "category", "text", "voice" ].includes(arg.toLowerCase()) ? arg : "text",
                    limit: (arg: number): number => numbers.clamp(arg, 1, 99),
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_CHANNELS" ],
            userPermissions: [ "MANAGE_CHANNELS" ],
            syntax: [
                "channels --create NAME -- REASON",
                "channels --create NAME --type TYPE -- REASON",
                "channels --create NAME --category ID -- REASON",
                "channels --create NAME --topic TOPIC -- REASON",
                "channels --create NAME --limit 1-99 -- REASON",
                "channels --create NAME --slowmode -- REASON",
                "channels --create NAME --nsfw -- REASON",
                "channels --delete -- REASON",
                "channels --rename NAME -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const reason = argv._.join(" ") || "-";

        if (argv.create && argv.create.length) {
            const name: string = argv.create.join(" ");

            // create the channel
            const channel = await message.guild.channels.create(name, {
                type: argv.type,
                bitrate: message.guild.premiumTier * 128e3 || 96e3,
                nsfw: argv.nsfw,
                reason,
                topic: argv.topic && argv.topic.length ? argv.topic.join(" ") : "",
                userLimit: argv.limit ? argv.limit : 0,
                rateLimitPerUser: argv.slowmode ? 5 : 0,
                parent: message.guild.channels.cache.has(argv.category) ? argv.category : (message.channel as GuildChannel).parent,
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", channel.type + "ChannelCreate", message.author.tag, channel.name, reason),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        if (argv.delete) {
            // get confirmation
            const answer = await confirmation(message, this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "channelDeleteQuestion", message.author.tag, (message.channel as GuildChannel).name));

            if (answer) {
                // delete channel
                await message.channel.delete(reason);
            }

            return true;
        }

        if (argv.rename && argv.rename.length) {
            // rename the channel
            const channel = await (message.channel as TextChannel).edit({
                name: argv.rename.join(" "),
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "textChannelRename", message.author.tag, channel.name, reason),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);
    }
}
