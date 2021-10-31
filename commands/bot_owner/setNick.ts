/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class SetNick extends Command {
    constructor() {
        super("setNick", {
            description: "It allows you to update Bastion's nickname in the server.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "setNick",
                "setNick NICKNAME",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const nickname = argv._.join(" ");

        // update nickname
        await message.guild.me.setNickname(nickname);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", nickname ? "setNick" : "resetNick", message.author.tag, nickname),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    };
}
