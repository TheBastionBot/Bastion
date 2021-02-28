/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");

export = class Prefix extends Command {
    constructor() {
        super("prefix", {
            description: "It allows you set custom prefixes for Bastion in your server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "prefix",
                "prefix -- PREFIX",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const guild = (message.guild as BastionGuild);

        if (argv._.length) {
            // check for premium membership limits
            if (argv._.length > constants.LIMITS.PREFIXES && constants.isPublicBastion(this.client.user)) {
                // fetch the premium tier
                const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                    // this error can be ignored
                });

                if (tier) { // check for premium membership limits
                    if (tier === omnic.PremiumTier.GOLD && argv._.length > constants.LIMITS.GOLD.PREFIXES) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitPrefix", constants.LIMITS.GOLD.PREFIXES));
                    } else if (tier === omnic.PremiumTier.PLATINUM && argv._.length > constants.LIMITS.PLATINUM.PREFIXES) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitPrefix", constants.LIMITS.PLATINUM.PREFIXES));
                    }
                } else {    // no premium membership
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumPrefix", constants.LIMITS.PREFIXES));
                }
            }


            // set guild prefixes
            guild.document.prefixes = argv._;

            // save document
            await guild.document.save();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "guildPrefixUpdate", message.author.tag, guild.document.prefixes.join("  ")),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // get the guild prefixes
        const prefixes = this.client.configurations.prefixes.concat(guild.document.prefixes);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "guildPrefixes"),
                fields: [
                    {
                        name: "Prefixes",
                        value: prefixes.join("  "),
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
