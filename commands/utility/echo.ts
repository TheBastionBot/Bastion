/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Client } from "@bastion/tesseract";
import { GuildMember, Message, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";
import * as embeds from "../../utils/embeds";
import BastionGuild = require("../../structures/Guild");

export = class EchoCommand extends Command {
    constructor() {
        super("echo", {
            description: "It allows you to send a message through Bastion to any channel or member in the server. It also supports Bastion embed objects.",
            triggers: [],
            arguments: {
                alias: {
                    channel: [ "c" ],
                    user: [ "u" ],
                    plain: [ "p" ],
                },
                boolean: [ "plain" ],
                string: [ "channel", "user" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_MESSAGES" ],
            syntax: [
                "echo -- MESSAGE",
                "echo --plain -- MESSAGE",
                "echo --channel ID -- MESSAGE",
                "echo --user USER -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const user: GuildMember = this.client.resolver.resolveGuildMember(message.guild, argv.user);
        const channel = user && message.member.permissions.has("MANAGE_GUILD") ? await user.createDM() : this.client.resolver.resolveGuildChannel(message.guild, argv.channel ? argv.channel : message.channel.id, [ "text", "news" ]) as TextChannel;

        if (!channel) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "channelNotFound"));

        const isOwner = (message.client as Client).credentials.owners?.includes(message.author.id);

        // validate input
        const rawData = argv._.join(" ");

        // check whether plain text output is requested
        if (isOwner && argv.plain) {
            return await channel.send(rawData);
        }


        let embed: string | embeds.MessageEmbedData;
        try {
            embed = JSON.parse(rawData);

            if (!embeds.isValidBastionEmbed(embed as embeds.MessageEmbedData)) throw new Error("INVALID_BASTION_EMBED");
        } catch {
            embed = rawData;
        }

        // acknowledge
        await channel.send({
            embed: {
                ...embeds.generateEmbed(embed),
                footer: {
                    text: isOwner ? "" : "Sent by " + message.author.tag + (user ? " from " + message.guild.name : ""),
                },
            },
        });
    };
}
