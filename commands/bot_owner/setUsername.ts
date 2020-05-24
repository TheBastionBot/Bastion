/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class SetUsername extends Command {
    constructor() {
        super("setUsername", {
            description: "It allows you to update Bastion's username directly from Discord.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "setUsername USERNAME",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const username = argv._.join(" ");

        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // update username
        await this.client.user.setUsername(username);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "updateUsername", message.author.tag, username),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
