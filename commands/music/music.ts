/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import GuildModel from "../../models/Guild";
import BastionGuild = require("../../structures/Guild");


export = class MusicCommand extends Command {
    constructor() {
        super("music", {
            description: "It toggles Bastion's music support in the specified server. Once enabled, you can use all music commands in the server.",
            triggers: [],
            arguments: {
                alias: {
                    server: [ "s" ],
                },
                string: [ "server" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // identify the guild
        const guildDocument = await GuildModel.findById(argv.server || message.guild.id);
        const guild = this.client.guilds.resolve(argv.server || message.guild.id);

        // check whether the guild exist
        if (!guildDocument) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "guildNotFound"));

        // check the status of music in the guild
        const status = guildDocument.music && guildDocument.music.enabled;

        // toggle music in the server
        guildDocument.music = {
            ...guildDocument.music,
            enabled: !status,
        };

        // save the guild
        await guildDocument.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: status ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", status ? "musicDisable" : "musicEnable", message.author.tag, guild ? guild.name : argv.server),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
