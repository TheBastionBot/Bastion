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

export = class GamblingCommand extends Command {
    constructor() {
        super("gambling", {
            description: "It allows you to enable (or disable) gambling in the server. When enabled, members can use their Bastion Coins to gamble in games.",
            triggers: [],
            arguments: {
                number: [ "multiplier" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "gambling",
                "gambling --multiplier 1..13",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // check for premium membership
        if (argv.multiplier && constants.isPublicBastion(this.client.user)) {
            if (!await omnic.isPremiumGuild(message.guild)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString("en_us", "errors", "premiumGamblingMultiplier"));
        }


        const guild = (message.guild as BastionGuild);

        const status = (argv.multiplier) ? true : !(guild.document.gambling && guild.document.gambling.enabled);

        guild.document.gambling = {
            // enable gambling if multiplier is specified, otherwise toggle it
            enabled: status,
            // set the gambling reward multiplier if specified, otherwise keep the old value based on whether gambling is enabled
            multiplier: typeof argv.multiplier === "number" ? argv.multiplier : status ? guild.document.gambling && guild.document.gambling.multiplier : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.gambling.enabled ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString("en_us", "info", guild.document.gambling.enabled ? "gamblingEnable" : "gamblingDisable", message.author.tag),
                fields: guild.document.gambling.enabled
                    ? [
                        {
                            name: "Gambling Reward Multiplier",
                            value: guild.document.gambling.multiplier ? guild.document.gambling.multiplier.toString() : (1).toString(),
                            inline: true,
                        },
                    ]
                    : [],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
