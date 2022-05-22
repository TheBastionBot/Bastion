/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as fs from "fs";
import { Command, CommandArguments, Constants, Logger } from "@bastion/tesseract";
import { Message, NewsChannel, TextChannel, VoiceChannel, Snowflake } from "discord.js";
import fetch from "node-fetch";
import * as youtube from "youtube-dl";
import { v4 as uuid } from "uuid";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import * as regex from "../../utils/regex";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

import { BastionConfigurations, BastionCredentials } from "../../typings/settings";


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
    entries: {
        id: string;
        url: string;
        title: string;
    }[];
}


export = class Play extends Command {
    private musicDirectory: string;

    constructor() {
        super("play", {
            description: "It allows you to play a music in the server, from the given query or from any supported source.",
            triggers: [ "p" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "play Remember The Name by Ed Sheeran",
                "play https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            ],
        });

        this.musicDirectory = "./music/";
    }

    private searchYouTube = async (query: string): Promise<string> => {
        const response = await fetch("https://youtube.googleapis.com/youtube/v3/search?part=id&regionCode=US&type=video&maxResults=5&q=" + encodeURIComponent(query) + "&key=" + (this.client.credentials as BastionCredentials).google.apiKey);

        if (response.ok) {
            const data = await response.json();
            if (data.items.length) return data.items[0].id.videoId;
            throw "No results found for the specified query.";
        } else {
            throw response.statusText;
        }
    };

    private getSongInfo(query: string, playlist?: boolean): Promise<YoutubeInfo> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            // try using the official YouTube API
            if ((this.client.credentials as BastionCredentials).google && (this.client.credentials as BastionCredentials).google.apiKey && !regex.URI.test(query)) {
                const videoId = await this.searchYouTube(query).catch(() => {
                    // this error can be ignored
                });
                if (videoId) return resolve({ url: "https://youtu.be/" + videoId, webpage_url: "https://youtube.com/watch?v=" + videoId } as YoutubeInfo);
            }

            // otherwise, fallback to `youtube-dl`
            youtube.getInfo(regex.URI.test(query) ? query : "ytsearch:" + query, [
                "--ignore-errors",
                // network options
                "--force-ipv4",
                // geo restriction
                "--geo-bypass-country=US",
                // video selection
                ...(playlist ? [ "--flat-playlist", "--yes-playlist" ] : [ "--no-playlist" ]),
                // filesystem options
                "--no-cache-dir",
                // verbosity / simulation
                (playlist ? "--dump-single-json" : "--dump-json"),
                "--quiet",
                "--no-warnings",
                // workarounds
                "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/604.1 (KHTML, like Gecko) Version/13.0.4 Safari/604.1",
                "--referer=https://bastion.traction.one",
                // video format
                `--format=bestaudio[ext=m4a]${constants.isPublicBastion(this.client.user) ? "[filesize<10M]" : ""}`,
                "--youtube-skip-dash-manifest",
            ], (error: Error, info: YoutubeInfo) => {
                if (error) return reject(error);
                return resolve(info);
            });
        });
    }

    private prepareStream = (songLink: string, message: Message, ignoreError: boolean): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const songId = uuid();

            // Create the music stream
            const stream = youtube(songLink, [
                "--ignore-errors",
                // network options
                "--force-ipv4",
                // geo restriction
                "--geo-bypass-country=US",
                // video selection
                "--no-playlist",
                // filesystem options
                "--no-cache-dir",
                // verbosity / simulation
                "--dump-json",
                "--quiet",
                "--no-warnings",
                // workarounds
                "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/604.1 (KHTML, like Gecko) Version/13.0.4 Safari/604.1",
                "--referer=https://bastion.traction.one",
                // video format
                `--format=bestaudio[ext=m4a]${constants.isPublicBastion(this.client.user) ? "[filesize<10M]" : ""}`,
                "--youtube-skip-dash-manifest",
            ], {});

            stream.on("info", (info: YoutubeInfo) => this.streamInfoHandler(message.guild as BastionGuild, { ...info, id: songId, requester: message.author.id }));
            stream.on("end", () => {
                this.streamEndHandler(message.guild as BastionGuild);
                resolve(true);
            });
            stream.on("error", error => {
                if (!ignoreError) {
                    message.channel.send({
                        embed: {
                            color: Constants.COLORS.RED,
                            description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "musicDownloadError"),
                        },
                    }).catch(() => {
                        // This error can be ignored.
                    });
                }

                reject(error);
            });

            stream.pipe(fs.createWriteStream(this.musicDirectory + message.guild.id + "/" + songId + ".m4a"));
        });
    };

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
                    text: (guild.music.queue.length ? "#" + (guild.music.queue.length - 1) : "Up Next") + ` • ${duration} • ${guild.members.cache.get(requester).user.tag || requester}`,
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
    };

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
            const dispatcher = guild.voice?.connection?.play(this.musicDirectory + guild.id + "/" + song.id + ".m4a");

            // Set playing activity
            if ((this.client.configurations as BastionConfigurations).music && (this.client.configurations as BastionConfigurations).music.activity) {
                this.client.user.setActivity({
                    name: song.track,
                    type: "LISTENING",
                }).catch(() => {
                    // This error can be ignored.
                });
            }

            dispatcher.on("finish", () => this.dispatcherFinishHandler(guild));
            dispatcher.on("error", (error: Error) => {
                Logger.error(error);
                this.dispatcherFinishHandler(guild);
            });
        } else {
            // Reset queue
            guild.music.queue = [];
            // Reset history queue
            guild.music.history = [];

            // Clear the music directory
            fs.promises.rm(this.musicDirectory + guild.id, { recursive: true }).catch(() => {
                // This error can be ignored.
            });

            // Reset playing activity
            if ((this.client.configurations as BastionConfigurations).music && (this.client.configurations as BastionConfigurations).music.activity) {
                this.client.user.setActivity(this.client.configurations.presence instanceof Array ? this.client.configurations.presence[0].activity : this.client.configurations.presence.activity).catch(() => {
                    // This error can be ignored.
                });
            }

            // Leave the voice channel, if `keepAlive` is disabled
            if (!guild.document.music.keepAlive) {
                guild.voice?.channel?.leave();
            }

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
    };

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
    };

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

        // check for premium membership
        if (constants.isPublicBastion(this.client.user)) {
            // fetch the premium tier
            const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                // this error can be ignored
            });

            if (!tier) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumMusic"));
        }

        const query = argv._.join(" ");
        const isQueryURL = regex.URI.test(query);
        const info = isQueryURL ? query.startsWith("http") && query.includes("youtube.com") && query.includes("playlist") ? await this.getSongInfo(query, true) : null : await this.getSongInfo(query);
        const songLinks: string[] = info ? query.startsWith("http") && query.includes("youtube.com") && query.includes("playlist") ? info.entries.map(i => "https://youtu.be/" + i.id) : [ info.webpage_url || info.url ] : isQueryURL ? [ query ] : null;

        // Command Syntax Validation
        if (!songLinks || !songLinks.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // Set the Music Text & Voice Channels
        guild.music.textChannel = message.guild.channels.cache.has(guild.document.music.textChannelId)
            ? message.guild.channels.cache.get(guild.document.music.textChannelId) as NewsChannel | TextChannel
            : message.channel as NewsChannel | TextChannel;

        guild.music.voiceChannel = message.guild.voice?.connection
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
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", (message.member as BastionGuildMember).isMusicMaster() ? "noMusicChannelsAsOwner" : "noMusicChannels"),
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
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "unjoinable", guild.music.voiceChannel.name),
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
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "unspeakable", guild.music.voiceChannel.name),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // Connect to the music channel
        const voiceConnection = await guild.music.voiceChannel.join();

        voiceConnection.on("error", Logger.error);
        voiceConnection.on("failed", Logger.error);

        // Set voice state
        message.guild.me.voice.setMute(false).catch(() => {
            // This error can be ignored.
        });
        message.guild.me.voice.setDeaf(true).catch(() => {
            // This error can be ignored.
        });

        // Create the music directory
        await fs.promises.mkdir(this.musicDirectory + message.guild.id + "/", { recursive: true }).catch(Logger.error);

        for (const songLink of songLinks) {
            await this.prepareStream(songLink, message, songLinks.length > 1).catch(Logger.error);
        }
    };
}
