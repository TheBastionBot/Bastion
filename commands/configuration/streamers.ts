/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import { Guild } from "../../models/Guild";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");

export = class InviteFilterCommand extends Command {
    constructor() {
        super("streamers", {
            description: "It allows you to follow streamers, from various platforms, in the server. When the streamers go live, or post a video, Bastion will notify about it in the server.",
            triggers: [],
            arguments: {
                alias: {
                    remove: [ "r" ],
                    twitch: [ "t" ],
                },
                boolean: [ "remove" ],
                string: [ "twitch" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "streamers",
                "streamers --twitch USERNAME",
                "streamers --twitch USERNAME --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        if (argv.twitch) {
            const guildObject: Guild = guild.document.toObject();

            // update twitch streamers
            guildObject.streamers = {
                ...guildObject.streamers,
                twitch: {
                    channelId: message.channel.id,
                    users: guildObject.streamers && guildObject.streamers.twitch && guildObject.streamers.twitch.users && guildObject.streamers.twitch.users.length && !guildObject.streamers.twitch.users.includes(argv.twitch)
                        ? guildObject.streamers.twitch.users.concat(argv.twitch)
                        : [ argv.twitch as string ],
                },
            };

            // remove the streamer, if specified
            if (argv.remove) {
                guildObject.streamers.twitch.users = guildObject.streamers.twitch.users.filter(streamer => streamer !== argv.twitch);

                // remove the entire object if no users are left
                if (guildObject.streamers.twitch.users.length === 0) {
                    guildObject.streamers.twitch = undefined;
                    delete guildObject.streamers.twitch;
                }
            }


            // check for premium membership limits
            if (guildObject.streamers.twitch && guildObject.streamers.twitch.users && guildObject.streamers.twitch.users.length > constants.LIMITS.STREAMERS_PER_SERVICE && constants.isPublicBastion(this.client.user)) {
                // fetch the premium tier
                const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                    // this error can be ignored
                });

                if (tier) { // check for premium membership limits
                    if (tier === omnic.PremiumTier.GOLD && guildObject.streamers.twitch.users.length > constants.LIMITS.GOLD.STREAMERS_PER_SERVICE) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitStreamers", constants.LIMITS.GOLD.STREAMERS_PER_SERVICE));
                    } else if (tier === omnic.PremiumTier.PLATINUM && guildObject.streamers.twitch.users.length > constants.LIMITS.PLATINUM.STREAMERS_PER_SERVICE) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitStreamers", constants.LIMITS.PLATINUM.STREAMERS_PER_SERVICE));
                    }
                } else {    // no premium membership
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumStreamers", constants.LIMITS.STREAMERS_PER_SERVICE));
                }
            }


            // update document
            guild.document.overwrite(guildObject);

            // save document
            await guild.document.save();
        }

        const fields = [];

        if (guild.document.streamers && guild.document.streamers.twitch) {
            fields.push({
                name: "Twitch",
                value: "<#" + guild.document.streamers.twitch.channelId + ">\n" +
                    (guild.document.streamers.twitch.users && guild.document.streamers.twitch.users.length ? guild.document.streamers.twitch.users.join("\n") : "-"),
            });
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.twitch && argv.twitch.length ? constants.COLORS.TWITCH : Constants.COLORS.IRIS,
                title: "Followed Streamers",
                fields: fields.length ? fields : [
                    {
                        name: "You aren't following any streamers.",
                        value: "See `" + this.name + " --help` for more information.",
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
