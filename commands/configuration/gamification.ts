/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as constants from "../../utils/constants";
import * as errors from "../../utils/errors";
import * as gamification from "../../utils/gamification";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");

export = class Gamification extends Command {
    constructor() {
        super("gamification", {
            description: "It allows you to enable (or disable) gamification in the server. When enabled, users gain experience and level up in the server by participating in the server, competing against each other to climb the leaderboard. It also allows you to toggle level up messages and set the level up multiplier.",
            triggers: [],
            arguments: {
                boolean: [ "messages" ],
                number: [ "multiplier" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "gamification",
                "gamification --messages",
                "gamification --multiplier NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // check for premium membership
        if (argv.multiplier && constants.isPublicBastion(this.client.user)) {
            // fetch the premium tier
            const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                // this error can be ignored
            });
            if (!tier) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumGamificationMultiplier"));
        }


        const guild = (message.guild as BastionGuild);

        const status = (typeof argv.messages === "boolean" || argv.multiplier) ? true : !(guild.document.gamification && guild.document.gamification.enabled);

        guild.document.gamification = {
            // enable gamification if either messages or multiplier is specified, otherwise toggle it
            enabled: status,
            // enable level up messages if specified, otherwise keep the old value based on whether gamification is enabled
            messages: typeof argv.messages === "boolean" ? argv.messages : status ? guild.document.gamification && guild.document.gamification.messages : undefined,
            // set the level up multiplier if specified, otherwise keep the old value based on whether gamification is enabled
            multiplier: typeof argv.multiplier === "number" ? argv.multiplier : status ? guild.document.gamification && guild.document.gamification.multiplier : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.gamification.enabled ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.gamification.enabled ? "gamificationEnable" : "gamificationDisable", message.author.tag),
                fields: guild.document.gamification.enabled
                    ? [
                        {
                            name: "Level-Up Messages",
                            value: guild.document.gamification.messages ? "Enabled" : "Disabled",
                            inline: true,
                        },
                        {
                            name: "Level-Up Multiplier",
                            value: guild.document.gamification.multiplier ? guild.document.gamification.multiplier.toString() : gamification.DEFAUL_LEVELUP_MULTIPLIER.toString(),
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
