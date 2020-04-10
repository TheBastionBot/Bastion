/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");


export = class Pause extends Command {
    constructor() {
        super("pause", {
            description: "It allows you to pause the music track that is currently being played in the server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
        });
    }

    exec = async (message: Message): Promise<unknown> => {
        const guild = (message.guild as BastionGuild);

        // Check whether music is enabled in the guild
        if (!guild.document.music || !guild.document.music.enabled) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", constants.isPublicBastion(message.author) ? "musicDisabledPublic" : "musicDisabled"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Check whether the command user is a Music Master
        if (!(message.member as BastionGuildMember).isMusicMaster()) return;

        if (guild.music.playing && guild.voice && guild.voice.connection.dispatcher && !guild.voice.connection.dispatcher.paused) {
            // Pause the dispatcher
            guild.voice.connection.dispatcher.pause(true);

            const song = guild.music.queue[0];

            const streamTime = guild.voice.connection.dispatcher.streamTime - guild.voice.connection.dispatcher.pausedTime;

            // Acknowledge
            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: "Paused Playback",
                    description: this.client.locale.getString("en_us", "info", "playbackPause", message.author.tag, song.track),
                    footer: {
                        text: `${Math.floor(streamTime / 6e4)}:${Math.floor((streamTime % 6e4) / 1e3)} / ${song.duration} • ${guild.voice.connection.channel.name}`
                    },
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }
}
