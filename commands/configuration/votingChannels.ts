/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, TextChannel } from "discord.js";

import TextChannelModel from "../../models/TextChannel";
import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";


export = class Announcements extends Command {
    constructor() {
        super("votingChannels", {
            description: "It allows you to set (and unset) channels as Voting Channels. If a channel is set as a Voting Channel, anything sent in the channel will be set up for everyone to vote.",
            triggers: [],
            arguments: {
                alias: {
                    add: [ "a" ],
                    remove: [ "r" ],
                },
                boolean: [ "add", "remove" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "votingChannels",
                "votingChannels --add",
                "votingChannels --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.add) {
            // check for premium membership
            if (constants.isPublicBastion(this.client.user)) {
                // find voting channels in the server
                const votingChannelsCount = await TextChannelModel.countDocuments({
                    guild: message.guild.id,
                    voting: true,
                });

                if (votingChannelsCount >= 3 && !await omnic.isPremiumGuild(message.guild)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString("en_us", "errors", "premiumVotingChannels", 3));
            }


            // set the channel as a voting channel
            await TextChannelModel.findByIdAndUpdate(message.channel.id, {
                _id: message.channel.id,
                guild: message.guild.id,
                voting: true,
            }, {
                upsert: true,
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString("en_us", "info", "votingChannelsAdd", message.author.tag),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        if (argv.remove) {
            // unset the channel as a voting channel
            await TextChannelModel.findByIdAndUpdate(message.channel.id, {
                _id: message.channel.id,
                guild: message.guild.id,
                $unset: {
                    voting: 1,
                },
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "info", "votingChannelsRemove", message.author.tag),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // get all voting channels
        const votingChannels = await TextChannelModel.find({
            guild: message.guild.id,
            voting: true,
        });

        // filter only channels that exist and remove the rest
        const channels: string[] = [];

        for (const channel of votingChannels) {
            if (message.guild.channels.cache.has(channel._id)) {
                channels.push((message.guild.channels.cache.get(channel._id) as TextChannel).name + " / " + channel._id);
            } else {
                await channel.remove().catch(() => {
                    // this error can be ignored
                });
            }
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Voting Channels",
                description: this.client.locale.getString("en_us", "info", "votingChannels"),
                fields: [
                    {
                        name: (channels.length ? channels.length : "No") + " Voting Channels",
                        value: channels.join("\n\n") || "-",
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
