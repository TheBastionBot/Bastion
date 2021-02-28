/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class SetAvatar extends Command {
    constructor() {
        super("setAvatar", {
            description: "It allows you to update Bastion's avatar directly from Discord.",
            triggers: [],
            arguments: {
                coerce: {
                    image: Constants.ArgumentTypes.URL,
                },
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "setAvatar --image LINK",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const image = message.attachments.first();

        // command syntax validation
        if (!argv.image || !(image.height && image.width)) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // update avatar
        await this.client.user.setAvatar(argv.image);

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "updateAvatar", message.author.tag),
                image: {
                    url: this.client.user.displayAvatarURL({
                        dynamic: true,
                        size: 256,
                    }),
                },
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
