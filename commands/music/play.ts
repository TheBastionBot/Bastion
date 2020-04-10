/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as fs from "fs";
import { Command, CommandArguments, Constants } from "tesseract";
import { Message, NewsChannel, TextChannel, VoiceChannel, Snowflake } from "discord.js";
import * as youtube from "youtube-dl";
import { v4 as uuid } from "uuid";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");


interface YoutubeInfo extends youtube.Info {
    id: string;
    track: string;
    album: string;
    artist: string;
    duration: string;
    thumbnail: string;
    requester: Snowflake;
    webpage_url: string;
    url: string;
    title: string;
    fulltitle: string;
    alt_title: string;
    creator: string;
    uploader: string;
}


export = class Play extends Command {
    private musicDirectory: string;

    constructor() {
        super("play", {
            description: "It allows you to play a music in the server, from the given queury or from any supported source.",
            triggers: [],
            arguments: {
                alias: {
                    link: "l",
                },
                coerce: {
                    link: Constants.ArgumentTypes.URL,
                },
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "play Remember The Name by Ed Sheeran",
                "play --link https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            ],
        });

        this.musicDirectory = "./music/";
    }

    private getSongInfo(query: string): Promise<YoutubeInfo> {
        return new Promise((resolve, reject) =>
            youtube.getInfo("ytsearch:" + query, [
                "--ignore-errors",
                // geo restriction
                "--geo-bypass-country=US",
                // video selection
                "--no-playlist",
                // verbosity / simulation
                "--quiet",
                "--no-warnings",
                // workarounds
                "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/604.1 (KHTML, like Gecko) Version/13.0.4 Safari/604.1",
                "--referer=https://bastion.traction.one",
                // video format
                "--format=bestaudio[protocol^=http]",
                "--youtube-skip-dash-manifest",
            ], (error: Error, info: YoutubeInfo) => {
                if (error) return reject(error);
                return resolve(info);
            })
        );
    }

    private streamInfoHandler = (guild: BastionGuild, info: YoutubeInfo): void => {
        const id = info.id;
        const track = info.track || info.title || info.fulltitle || info.alt_title;
        const album = info.album;
        const artist = info.artist || info.creator || info.uploader;
        const duration = info.duration;
        const thumbnail = info.thumbnail;
        const requester = info.requester;

        // Add to Queue
        guild.music.queue.push({
            id,
            track,
            album,
            artist,
            duration,
            thumbnail,
            requester,
        });

        // Acknowledge
        const fields = [];

        if (album) {
            fields.push({
                name: "Album",
                value: album,
                inline: true,
            });
        }
        if (artist) {
            fields.push({
                name: "Artist",
                value: artist,
                inline: true,
            });
        }

        guild.music.textChannel.send({
            embed: {
                color: Constants.COLORS.PINK,
                title: "Added to Queue",
                description: track,
                fields: fields,
                thumbnail: {
                    url: thumbnail,
                },
                footer: {
                    text: `#${guild.music.queue.length} • ${duration} • ${guild.members.cache.get(requester).user.tag || requester}`
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    };

    private streamEndHandler = (guild: BastionGuild): void => {
        if (!guild.music.playing) {
            this.startStreamDispatcher(guild);
        }
    }

    private startStreamDispatcher = (guild: BastionGuild): void => {
        if (guild.music.queue.length) {
            const song = guild.music.queue[0];

            // Acknowledge
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

            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: "Playing",
                    description: song.track,
                    fields: fields,
                    thumbnail: {
                        url: song.thumbnail,
                    },
                    footer: {
                        text: `${song.duration} • ${guild.members.cache.get(song.requester).user.tag || song.requester}`
                    },
                },
            }).catch(() => {
                // This error can be ignored.
            });

            // Set playing status
            guild.music.playing = true;

            // Start the dispatcher
            const dispatcher = guild.voice && guild.voice.connection.play(this.musicDirectory + song.id + ".mp3");

            // Set playing activity
            this.client.user.setActivity({
                name: song.track,
                type: "LISTENING",
            }).catch(() => {
                // This error can be ignored.
            });

            dispatcher.on("finish", () => this.dispatcherFinishHandler(guild));
            dispatcher.on("error", (error: Error) => {
                this.client.log.error(error);
                this.dispatcherFinishHandler(guild);
            });
        } else {
            // Reset queue
            guild.music.queue = [];
            // Reset history queue
            guild.music.history = [];

            // Clear the music directory
            fs.promises.rmdir(this.musicDirectory, { recursive: true }).catch(() => {
                // This error can be ignored.
            });

            // Reset playing activity
            this.client.user.setActivity(this.client.configurations.presence.activity).catch(() => {
                // This error can be ignored.
            });

            // Leave the voice channel
            guild.voice && guild.voice.channel.leave();

            // Acknowledge
            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: "Stopping Playback",
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }

    private dispatcherFinishHandler = (guild: BastionGuild): void => {
        // Reset playing status
        guild.music.playing = false;
        // Reset skip votes
        guild.music.skipVotes = [];

        // Add the completed song to history
        if (guild.music.queue.length) {
            guild.music.history.push(guild.music.queue.shift());
        }

        // Repeat the history queue
        if (!guild.music.queue.length && guild.music.repeat) {
            guild.music.queue = guild.music.history;
            // Reset the history queue
            guild.music.history = [];
        }

        this.startStreamDispatcher(guild);
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
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

        const query = argv._.join(" ");
        const info = query.length ? await this.getSongInfo(query) : null;
        const songLink: string = argv.link ? argv.link.href : info ? info.webpage_url || info.url : null;

        // Command Syntax Validation
        if (!songLink) throw new errors.CommandSyntaxError(this.name);

        // Set the Music Text & Voice Channels
        guild.music.textChannel = message.guild.channels.cache.has(guild.document.music.textChannelId)
            ? message.guild.channels.cache.get(guild.document.music.textChannelId) as NewsChannel | TextChannel
            : message.channel as NewsChannel | TextChannel;

        guild.music.voiceChannel = message.guild.voice && message.guild.voice.connection
            ? message.guild.voice.channel
            : message.guild.channels.cache.filter(c => c.type === "voice").has(guild.document.music.voiceChannelId)
                ? message.guild.channels.cache.filter(c => c.type === "voice").get(guild.document.music.voiceChannelId) as VoiceChannel
                : (message.member as BastionGuildMember).isMusicMaster()
                    ? message.member.voice.channel
                    : null;

        // Check whether music voice channel is available
        if (!guild.music.voiceChannel) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", (message.member as BastionGuildMember).isMusicMaster() ? "noMusicChannelsAsOwner" : "noMusicChannels"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Check whether the voice channel is joinable
        if (!guild.music.voiceChannel.joinable) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", "unjoinable", guild.music.voiceChannel.name),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Check whether Bastion can speak in the voice channel
        if (!guild.music.voiceChannel.speakable) {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", "unspeakable", guild.music.voiceChannel.name),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Connect to the music channel
        const voiceConnection = await guild.music.voiceChannel.join();

        voiceConnection.on("error", this.client.log.error);
        voiceConnection.on("failed", this.client.log.error);

        // Set voice state
        message.guild.me.voice.setMute(false).catch(() => {
            // This error can be ignored.
        });
        message.guild.me.voice.setDeaf(true).catch(() => {
            // This error can be ignored.
        });

        const songId = uuid();

        // Create the music stream
        const stream = youtube(songLink, [
            "--ignore-errors",
            // geo restriction
            "--geo-bypass-country=US",
            // video selection
            "--no-playlist",
            // verbosity / simulation
            "--quiet",
            "--no-warnings",
            // workarounds
            "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/604.1 (KHTML, like Gecko) Version/13.0.4 Safari/604.1",
            "--referer=https://bastion.traction.one",
            // video format
            "--format=bestaudio[protocol^=http]",
            "--youtube-skip-dash-manifest",
        ], {});

        stream.on("info", (info: YoutubeInfo) => this.streamInfoHandler(guild, { ...info, id: songId, requester: message.author.id }));
        stream.on("end", () => this.streamEndHandler(guild));
        stream.on("error", () => {
            message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", "musicDownloadError"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        });

        // Create the music directory
        await fs.promises.mkdir(this.musicDirectory, { recursive: true }).catch(this.client.log.error);

        stream.pipe(fs.createWriteStream(this.musicDirectory + songId + ".mp3"));
    }
}
