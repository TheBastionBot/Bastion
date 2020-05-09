/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";
import { inspect } from "util";

import * as errors from "../../utils/errors";

export = class Eval extends Command {
    constructor() {
        super("eval", {
            description: "It allows you to execute JavaScript code inside Bastion's context.",
            triggers: [],
            arguments: {
                alias: {
                    broadcast: [ "b" ],
                    code: [ "c" ],
                    delete: [ "d" ],
                    quiet: [ "q" ],
                },
                array: [ "code" ],
                boolean: [ "broadcast", "delete", "quiet" ],
                string: [ "code" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "eval --code JAVASCRIPT_CODE",
                "eval --code JAVASCRIPT_CODE --broadcast",
                "eval --code JAVASCRIPT_CODE --delete",
                "eval --code JAVASCRIPT_CODE --quiet",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 1000 ? string.slice(0, 1000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv.code || !argv.code.length) throw new errors.CommandSyntaxError(this.name);

        const code = argv.code.join(" ");

        // evaluate the code
        let stdout: string, stderr: string;

        try {
            stdout = argv.broadcast ? await this.client.shard.broadcastEval(code) : eval(code);
            if (typeof stdout !== "string") stdout = inspect(stdout);
        } catch (e) {
            stderr = e.toString();
        }

        if (!argv.quiet) {
            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.PUPIL,
                    title: "Evaluator",
                    fields: [
                        {
                            name: "INPUT",
                            value: "```js\n" + this.sanitize(code) + "```",
                        },
                        {
                            name: stderr ? "ERROR" : "OUTPUT",
                            value: "```js\n" + this.sanitize(stderr ? stderr : stdout) + "```",
                        },
                    ],
                },
            }).then(output => {
                if (argv.delete) {
                    if (message.deletable) message.delete({ timeout: 1e4 });
                    output.delete({ timeout: 1e4 });
                }
            });
        }
    }
}
