/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class Unban extends Command {
    constructor() {
        super("unban", {
            description: "It allows you to unban the users who're banned in the server.",
            triggers: [],
            arguments: {
                alias: {
                    user: "u",
                },
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "BAN_MEMBERS" ],
            userPermissions: [ "BAN_MEMBERS" ],
            syntax: [
                "unban --user USER_ID -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Resolve user
        const user = this.client.resolver.resolveUser(argv.user);

        // Command Syntax Validation
        if (!user) throw new errors.CommandSyntaxError(this.name);

        // Unban user
        const reason = argv._.join(" ") || "-";

        await message.guild.members.unban(user, reason);

        // Acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.ORANGE,
                description: this.client.locale.getString("en_us", "info", "guildBanRemove", message.author.tag, user.tag),
                fields: [
                    {
                        name: "Reason",
                        value: reason,
                    },
                ],
                footer: {
                    text: user.id,
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
