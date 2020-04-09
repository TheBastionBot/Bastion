/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as pagination from "../../utils/pagination";

import BastionGuild = require("../../structures/Guild");


export = class Queue extends Command {
    constructor() {
        super("queue", {
            description: "",
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

        if (guild.music.playing && guild.voice && guild.voice.connection.dispatcher) {
            const nowPlaying = guild.music.queue[0];
            const queue = pagination.paginate(guild.music.queue.slice(1), argv.page);

            const streamTime = guild.voice.connection.dispatcher.streamTime - guild.voice.connection.dispatcher.pausedTime;

            // Acknowledge
            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: "Music Queue",
                    description: this.client.locale.getString("en_us", "info", "queueCount", (guild.music.queue.length - 1).toString()),
                    fields: queue.items.map((song: { track: string; artist: string; album: string }, i) => ({
                        name: `#${i + 1} - ${song.track}`,
                        value: `${song.artist || "Unknown Artist"}${song.track !== song.album ? " - " + song.album : ""}`,
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
