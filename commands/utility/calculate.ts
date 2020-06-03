/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import * as math from "mathjs";

import * as errors from "../../utils/errors";

export = class CalculateCommand extends Command {
    constructor() {
        super("calculate", {
            description: "It allows you to evaluate mathematical expressions and see their result.",
            triggers: [ "calc" ],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "calculate -- EXPRESSION",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 1000 ? string.slice(0, 1000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const expression = argv._.join(" ");

        let stdout: string, stderr: string;

        // evaluate the expression
        try {
            stdout = math.evaluate(expression).toString();
        } catch (e) {
            stderr = e.toString();
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Calculator",
                fields: [
                    {
                        name: "INPUT",
                        value: "```js\n" + this.sanitize(expression) + "```",
                    },
                    {
                        name: stderr ? "ERROR" : "OUTPUT",
                        value: "```js\n" + this.sanitize(stderr ? stderr : stdout) + "```",
                    },
                ],
            },
        });
    }
}
