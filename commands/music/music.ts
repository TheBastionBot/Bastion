/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import GuildModel from "../../models/Guild";
import BastionGuild = require("../../structures/Guild");


export = class MusicCommand extends Command {
    constructor() {
        super("music", {
            description: "It toggles Bastion's music support in the specified server. Once enabled, you can use all music commands in the server. It also allows you to see the list of servers where music is enabled.",
            triggers: [],
            arguments: {
                alias: {
                    server: [ "s" ],
                    servers: [ "l" ],
                },
                boolean: [ "servers" ],
                string: [ "server" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "music",
                "music --server SERVER_ID",
                "music --servers",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // check for premium membership
        if (constants.isPublicBastion(this.client.user)) {
            // fetch the premium tier
            const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                // this error can be ignored
            });

            if (!tier) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumMusic"));
        }

        // allow only bot owner to enable music for other servers & see servers where music is enabled
        if (this.client.credentials.owners.includes(message.author.id)) {
            if (argv.servers) {
                // find the guilds
                const guildDocuments = await GuildModel.find({
                    "music.enabled": {
                        $exists: true,
                        $eq: true,
                    },
                });

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        title: "Music Servers",
                        description: "Music is enabled in the following servers.",
                        fields: [
                            {
                                name: guildDocuments.length + " Servers",
                                value: guildDocuments.map(guild => guild.id).join("\n") || "-",
                            },
                        ],
                    },
                });
            }
        } else {
            argv.server = message.guild.id;
        }


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
