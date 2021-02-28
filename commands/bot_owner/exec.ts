/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";
import { promisify } from "util";
import { exec as exe } from "child_process";

import * as errors from "../../utils/errors";

const exec = promisify(exe);


export = class Exec extends Command {
    constructor() {
        super("exec", {
            description: "It allows you to execute commands in the terminal where Bastion is running.",
            triggers: [],
            arguments: {
                alias: {
                    command: [ "c" ],
                    delete: [ "d" ],
                    quiet: [ "q" ],
                },
                array: [ "command" ],
                boolean: [ "delete", "quiet" ],
                string: [ "command" ],
            },
            scope: "guild",
            owner: true,
            unsafe: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "exec --command COMMAND",
                "exec --command COMMAND --delete",
                "exec --command COMMAND --quiet",
            ],
        });
    }

    sanitize = (string: string): string => {
        return string.length > 1000 ? string.slice(0, 1000) + "\n..." : string;
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv.command || !argv.command.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const command = argv.command.join(" ");

        let stdout: string, stderr: string;

        // execute the command
        await exec(command, { timeout: 6e4 })
            .then(result => {
                if (result.stdout) stdout = result.stdout;
                if (result.stderr) stderr = result.stderr;
            })
            .catch(error => {
                if (error.stdout) stdout = error.stdout;
                if (error.stderr) stderr = error.stderr;

                if (!error.stdout && !error.stderr) stderr = "# TIMED OUT";
            });

        const fields = [
            {
                name: "INPUT",
                value: "```bash\n" + command + "```",
            },
        ];
        if (stdout) {
            fields.push({
                name: "OUTPUT",
                value: "```bash\n" + this.sanitize(stdout) + "```",
            });
        }
        if (stderr) {
            fields.push({
                name: "ERROR",
                value: "```bash\n" + this.sanitize(stderr) + "```",
            });
        }

        if (!argv.quiet) {
            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.PUPIL,
                    title: "Evaluator",
                    fields: fields,
                },
            }).then(output => {
                if (argv.delete) {
                    if (message.deletable) message.delete({ timeout: 1e4 }).catch(() => {
                        // this error can be ignored
                    });
                    output.delete({ timeout: 1e4 }).catch(() => {
                        // this error can be ignored
                    });
                }
            });
        }
    }
}
