/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

export = class HelpCommand extends Command {
    constructor() {
        super("help", {
            description: "",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        // list all the command categories
        await message.channel.send({
            embed: {
                color: Constants.COLORS.YELLOW,
                author: {
                    name: this.client.locale.getConstant("bastion.name"),
                    url: this.client.locale.getConstant("bastion.website"),
                },
                title: "Help",
                description: this.client.locale.getString("en_us", "info", "commandCategoriesCommand") + "\n"
                    + this.client.locale.getString("en_us", "info", "categoryCommandsCommand") + "\n"
                    + this.client.locale.getString("en_us", "info", "commandDetailsOption"),
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
                    text: this.client.locale.getString("en_us", "info", "didYouKnowDeveloper", this.client.locale.getConstant("author.username")),
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
