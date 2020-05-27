/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, User } from "discord.js";

export = class AvatarCommand extends Command {
    constructor() {
        super("avatar", {
            description: "It allows you see the avatar of a user.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "avatar",
                "avatar USER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const identifier: string = argv._.join(" ");

        let user: User;

        // identify the user
        if (identifier) {
            user = await this.client.users.fetch(identifier);
        } else {
            user = message.author;
        }


        // acknowledge
        return message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: user.tag,
                },
                title: "Avatar",
                image: {
                    url: user.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                    }),
                },
                footer: {
                    text: user.id,
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
