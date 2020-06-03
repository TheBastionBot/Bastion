/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as arrays from "../../utils/arrays";
import * as constants from "../../utils/constants";
import * as numbers from "../../utils/numbers";
import * as pagination from "../../utils/pagination";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");


export = class Queue extends Command {
    constructor() {
        super("queue", {
            description: "It allows you to see the current music queue of the server. It also allows you to clear, or shuffle the music queue as well as remove a song from the queue, or set (and unset) the queue in loop.",
            triggers: [],
            arguments: {
                alias: {
                    clear: [ "c" ],
                    loop: [ "l" ],
                    remove: [ "r" ],
                    shuffle: [ "s" ],
                },
                boolean: [ "clear", "loop", "shuffle" ],
                number: [ "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "queue",
                "queue --loop",
                "queue --shuffle",
                "queue --clear",
                "queue --remove 13",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
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
            const nowPlaying = guild.music.queue[0];

            if (argv.clear) {
                // Check whether the command user is a Music Master
                if (!(message.member as BastionGuildMember).isMusicMaster()) return;

                // Clear queue
                guild.music.queue = [ nowPlaying ];
                // Reset history queue
                guild.music.history = [];

                // Acknowledge
                guild.music.textChannel.send({
                    embed: {
                        color: Constants.COLORS.PINK,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "musicQueueClean", message.author.tag),
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            } else if (argv.loop) {
                guild.music.repeat = !guild.music.repeat;

                // Acknowledge
                guild.music.textChannel.send({
                    embed: {
                        color: Constants.COLORS.PINK,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.music.repeat ? "musicQueueRepeatEnabled" : "musicQueueRepeatDisable", message.author.tag),
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            } else if (argv.remove && guild.music.queue.length > 1 && numbers.inRange(argv.remove, 1, guild.music.queue.length - 1)) {
                // Check whether the command user is a Music Master,
                // if they're removing a song requested by someone else
                if (!(message.member as BastionGuildMember).isMusicMaster() && guild.music.queue[argv.remove].requester !== message.author.id) return;

                // Remove the song from the queue
                const removedSong = guild.music.queue.splice(argv.remove, 1)[0];

                // Acknowledge
                guild.music.textChannel.send({
                    embed: {
                        color: Constants.COLORS.PINK,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "musicQueueRemove", message.author.tag, removedSong.track, this.client.users.cache.has(removedSong.requester) ? this.client.users.cache.get(removedSong.requester).tag : removedSong.requester),
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            } else if (argv.shuffle) {
                // Check whether the command user is a Music Master
                if (!(message.member as BastionGuildMember).isMusicMaster()) return;

                // Shuffle queue
                const shuffledQueue = arrays.shuffle(guild.music.queue.slice(1)) as typeof guild.music.queue;

                guild.music.queue = [ nowPlaying, ...shuffledQueue ];

                // Acknowledge
                guild.music.textChannel.send({
                    embed: {
                        color: Constants.COLORS.PINK,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "musicQueueShuffle", message.author.tag),
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            } else {
                const streamTime = guild.voice.connection.dispatcher.streamTime - guild.voice.connection.dispatcher.pausedTime;

                const queue = pagination.paginate(guild.music.queue.slice(1), argv.page);

                // Acknowledge
                guild.music.textChannel.send({
                    embed: {
                        color: Constants.COLORS.PINK,
                        title: "Music Queue",
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "musicQueueCount", (guild.music.queue.length - 1).toString()),
                        fields: queue.items.map((song: { track: string; artist: string; album: string }, i) => ({
                            name: `#${i + 1} - ${song.track}`,
                            value: `${song.artist || "Unknown Artist"}${song.album && song.track !== song.album ? " - " + song.album : ""}`,
                        })),
                        footer: {
                            text: `${nowPlaying.track} • ${Math.floor(streamTime / 6e4)}:${Math.floor((streamTime % 6e4) / 1e3)} / ${nowPlaying.duration} • ${guild.voice.connection.channel.name} • Page ${queue.page} of ${queue.pages}`
                        },
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            }
        }
    }
}
