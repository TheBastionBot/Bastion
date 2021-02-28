/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";

import BastionGuild = require("../../structures/Guild");


export = class NowPlaying extends Command {
    constructor() {
        super("nowPlaying", {
            description: "It shows you the music track that is currently being played in the server.",
            triggers: [ "np" ],
            arguments: {},
            scope: "guild",
            owner: false,
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
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", constants.isPublicBastion(message.author) ? "musicDisabledPublic" : "musicDisabled"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        if (guild.music.playing && guild.voice && guild.voice.connection.dispatcher) {
            const song = guild.music.queue[0];

            const streamTime = guild.voice.connection.dispatcher.streamTime - guild.voice.connection.dispatcher.pausedTime;

            const fields = [];

            if (song.album) {
                fields.push({
                    name: "Album",
                    value: song.album,
                    inline: true,
                });
            }
            if (song.artist) {
                fields.push({
                    name: "Artist",
                    value: song.artist,
                    inline: true,
                });
            }
            fields.push({
                name: "Requestor",
                value: `${this.client.users.cache.get(song.requester).tag} / ${song.requester}`,
            });
            if (guild.music.queue.length > 1) {
                const upNext = guild.music.queue[1];

                fields.push({
                    name: "Up Next",
                    value: upNext.track + " - " + (upNext.artist || "Unknown Artist"),
                });
            }

            // Acknowledge
            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: guild.voice.connection.dispatcher.paused ? "Paused" : "Now Playing",
                    description: song.track,
                    fields: fields,
                    thumbnail: {
                        url: song.thumbnail,
                    },
                    footer: {
                        text: `🔉 ${guild.voice.connection.dispatcher.volume * 100}% • ${Math.floor(streamTime / 6e4)}:${Math.floor((streamTime % 6e4) / 1e3)} / ${song.duration} • ${guild.voice.connection.channel.name}`
                    },
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }
}
