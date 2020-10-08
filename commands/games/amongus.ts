/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants, Logger } from "@bastion/tesseract";
import { Message, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class AmongUsCommand extends Command {
    constructor() {
        super("amongus", {
            description: "It allows you create Among Us lobbies with necessary channels for Discussion and Muted users, and gives the lobby host easy ways to manage them automatically.",
            triggers: [],
            arguments: {
                boolean: [ "allow" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_CHANNELS", "MANAGE_ROLES", "MOVE_MEMBERS", "MUTE_MEMBERS" ],
            userPermissions: [],
            syntax: [
                "amongus CODE",
                "amongus --allow USERS...",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.allow) {
            if ((message.channel as TextChannel).name === "commands" && (message.channel as TextChannel).topic === message.author.id) {
                for (const member of Array.from(message.mentions.members.values()).slice(0, 10)) {
                    await (message.channel as TextChannel).updateOverwrite(member, {
                        ADD_REACTIONS: true,
                    });
                }
            }
            return;
        }

        // check whether the the among us channel exists
        if (!(message.guild as BastionGuild).document.amongUsChannel) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "noAmongUsChannel"));

        // check whether the commannd is being run in the among us channel
        if ((message.guild as BastionGuild).document.amongUsChannel !== message.channel.id) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "notAmongUsChannel", (message.guild as BastionGuild).document.amongUsChannel));

        // lobby info
        const lobbyIndex = message.guild.channels.cache.filter(c => c.type === "category").filter(c => c.name.startsWith("Among Us Lobby ")).size + 1;
        const lobbyName = "Among Us Lobby " + (argv._.length ? argv._.join("") : ("#" + lobbyIndex));

        // create the lobby category
        const lobby = await message.guild.channels.create(lobbyName, {
            type: "category",
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: [ "ADD_REACTIONS", "CONNECT", "SEND_MESSAGES" ],
                },
                {
                    id: message.guild.id,
                    allow: [ "USE_VAD", "VIEW_CHANNEL" ],
                    deny: [ "ADD_REACTIONS", "CONNECT", "SEND_MESSAGES" ],
                },
            ],
        });

        // create the commands channel
        const commandsChannel = await message.guild.channels.create("commands", {
            type: "text",
            parent: lobby,
            topic: message.author.id,
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: [ "ADD_REACTIONS", "SEND_MESSAGES" ],
                },
                {
                    id: message.guild.id,
                    allow: [ "VIEW_CHANNEL" ],
                    deny: [ "ADD_REACTIONS", "SEND_MESSAGES" ],
                },
            ],
        });

        // create the discussion channel
        await message.guild.channels.create("Discussion", {
            type: "voice",
            bitrate: message.guild.premiumTier * 128e3 || 96e3,
            parent: lobby,
            userLimit: 10,
            permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: [ "CONNECT" ],
                },
                {
                    id: message.guild.id,
                    allow: [ "SPEAK", "USE_VAD", "VIEW_CHANNEL" ],
                    deny: [ "CONNECT" ],
                },
            ],
        });

        // create the muted channel
        await message.guild.channels.create("Muted", {
            type: "voice",
            bitrate: message.guild.premiumTier * 128e3 || 96e3,
            parent: lobby,
            userLimit: 10,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    allow: [ "VIEW_CHANNEL" ],
                    deny: [ "CONNECT", "SPEAK" ],
                },
            ],
        });

        message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Among Us Lobby",
                description: "Your Among Us lobby is ready. Go to <#" + commandsChannel.id + "> to join the party."
            },
        }).catch(Logger.error);

        // send the intro message
        const introMessage = await commandsChannel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: lobbyName,
                description: `
**Players' Actions**\n
- 🔈 Use this to get access to join the **Discussion** Voice Channel.
- 👻 Use this when you're dead to mute yourself.

**Lobby Host's Actions**\n
- 🖐🏻 Call Meeting and move Muted players to the Discussion channel.
- 🔇 End meeting and move players to Muted channel.
- 🔓 Make the lobby public and let everyone can join the lobby.
- ❌ End game and close the lobby.

**It's dangerous to play alone.** Allow others to join your lobby using the \`amongUs --allow @mentions...\` command in this channel.
\n`,
                fields: [
                    {
                        name: "Lobby Host",
                        value: message.member.displayName + " / " + message.author.id,
                    },
                    {
                        name: "Game Code",
                        value: argv._.length ? argv._.join("") : "-",
                        inline: true,
                    },
                ],
            },
        });

        // add reactions to intro message
        const emojis = [ "🔈", "👻", "🖐🏻", "🔇", "🔓", "❌" ];

        for (const emoji of emojis) {
            await introMessage.react(emoji);
        }
    }
}
