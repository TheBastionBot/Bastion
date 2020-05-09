/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");


export = class Volume extends Command {
    constructor() {
        super("volume", {
            description: "It allows you to set the volume of the music track that is currently being played in the server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "volume 42",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        let volume = Number.parseInt(argv._[0]);

        // Command Syntax Validation
        if (!argv._.length || !Number.isInteger(volume)) throw new errors.CommandSyntaxError(this.name);

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
            // Cap the volume between 0.01 and 2
            volume = volume < 1 ? 1 : volume > 200 ? 200 : volume;

            // Set the dispatcher volume
            guild.voice.connection.dispatcher.setVolume(volume / 100);

            const song = guild.music.queue[0];

            // Acknowledge
            guild.music.textChannel.send({
                embed: {
                    color: Constants.COLORS.PINK,
                    title: "Volume",
                    description: this.client.locale.getString("en_us", "info", "setVolume", message.author.tag, volume),
                    footer: {
                        text: `${song.track} • ${guild.voice.connection.channel.name}`
                    },
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }
}
