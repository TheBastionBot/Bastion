/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "@bastion/tesseract";
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
                },
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
                "echo --channel ID -- MESSAGE",
                "echo --user ID -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const user: GuildMember = this.client.resolver.resolveGuildMember(message.guild, argv.user);
        const channel = user ? await user.createDM() : this.client.resolver.resolveGuildChannel(message.guild, argv.channel ? argv.channel : message.channel.id, [ "text", "news" ]) as TextChannel;

        if (!channel) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "channelNotFound"));

        // validate input
        const rawData = argv._.join(" ");
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
                    text: "Sent by " + message.author.tag + (user ? " from " + message.guild.name : ""),
                },
            },
        });
    }
}
