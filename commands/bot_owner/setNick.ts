/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

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
                description: this.client.locale.getString("en_us", "info", nickname ? "setNick" : "resetNick", message.author.tag, nickname),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
