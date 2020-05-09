/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

export = class ChooseCommand extends Command {
    constructor() {
        super("choose", {
            description: "It allows you to ask Bastion to choose an option from the given set of options. Let Bastion make a decision for you.",
            triggers: [ "decide" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "choose -- OPTIONS...",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.CommandSyntaxError(this.name);

        const choice: string = argv._[Math.floor(Math.random() * argv._.length)];

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "My choice would be...",
                description: choice,
            },
        });
    }
}
