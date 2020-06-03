/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");
import BastionUser = require("../../structures/User");

export = class CoinsCommand extends Command {
    constructor() {
        super("coins", {
            description: "It allows you to see your Bastion Account.",
            triggers: [ "balance" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<unknown> => {
        // get user's profile data
        const userProfile = (message.author as BastionUser).document;
        const memberProfile = (message.member as BastionGuildMember).document;

        // check whether user profile exists
        if (!userProfile || !memberProfile) throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "profileNotFound"));


        // acknowledge
        return message.channel.send({
            embed: {
                color: userProfile.color || Constants.COLORS.IRIS,
                author: {
                    name: message.member.user.tag,
                },
                title: "Bastion Account",
                fields: [
                    {
                        name: "Bastion Coins",
                        value: memberProfile.balance,
                        inline: true,
                    },
                ],
                thumbnail: {
                    url: message.member.user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                footer: {
                    text: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowDailyCoins"),
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
