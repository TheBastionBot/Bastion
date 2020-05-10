/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

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
            // update twitch streamers
            guild.document.streamers = {
                ...guild.document.streamers,
                twitch: {
                    channelId: message.channel.id,
                    users: guild.document.streamers && guild.document.streamers.twitch && guild.document.streamers.twitch.users && guild.document.streamers.twitch.users.length && !guild.document.streamers.twitch.users.includes(argv.twitch)
                        ? guild.document.streamers.twitch.users.concat(argv.twitch)
                        : [ argv.twitch as string ],
                },
            };

            // remove the streamer, if specified
            if (argv.remove) {
                guild.document.streamers.twitch.users = guild.document.streamers.twitch.users.filter(streamer => streamer !== argv.twitch);

                // remove the entire object if no users are left
                if (guild.document.streamers.twitch.users.length === 0) {
                    guild.document.streamers.twitch = undefined;
                    delete guild.document.streamers.twitch;
                }
            }


            // check for premium membership
            if (guild.document.streamers.twitch.users.length > 3 && constants.isPublicBastion(this.client.user)) {
                if (!await omnic.isPremiumGuild(message.guild)) throw new errors.PremiumMembershipError(this.client.locale.getString("en_us", "errors", "premiumStreamers", 3));
            }


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
