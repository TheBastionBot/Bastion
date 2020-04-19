/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class ChannelsCommand extends Command {
    constructor() {
        super("iam", {
            description: "It allows you add (and remove) yourself to (and from) the Self Roles set in the server.",
            triggers: [],
            arguments: {
                alias: {
                    not: [ "n" ],
                },
                boolean: [ "not" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "iam ROLE",
                "iam --not ROLE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        const role = this.client.resolver.resolveRole(message.guild, argv._.join(" "));

        if (!role) throw new errors.RoleNotFound(this.client.locale.getString("en_us", "errors", "roleNotFound"));

        if (argv.not) {
            // remove the role
            await message.member.roles.remove(role);
        } else {
            // add the role
            await message.member.roles.add(role);
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.not ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                description: this.client.locale.getString("en_us", "info", argv.not ? "selfRemoveRole" : "selfAddRole", message.author.tag, role.name),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
