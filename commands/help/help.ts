/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class HelpCommand extends Command {
    constructor() {
        super("help", {
            description: "",
            triggers: [],
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

    exec = async (message: Message): Promise<void> => {
        await message.channel.send({
            embed: {
                color: Constants.COLORS.YELLOW,
                author: {
                    name: this.client.locale.getConstant("bastion.name"),
                    url: this.client.locale.getConstant("bastion.website"),
                },
                title: "Help",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandCategoriesCommand") + "\n"
                    + this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "categoryCommandsCommand") + "\n"
                    + this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandDetailsOption"),
                fields: [
                    {
                        name: "Need help with " + this.client.locale.getConstant("bastion.name") + "?",
                        value: "[Join " + this.client.locale.getConstant("bastion.server.name") + "](" + this.client.locale.getConstant("bastion.server.invite") + ")",
                        inline: true,
                    },
                    {
                        name: "Wanna give awesome perks to your server?",
                        value: "[Invite " + this.client.locale.getConstant("bastion.name") + " to your server](" + this.client.locale.getConstant("bastion.bot.invite") + ")",
                        inline: true,
                    },
                ],
                footer: {
                    text: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowDeveloper", this.client.locale.getConstant("author.username")),
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
