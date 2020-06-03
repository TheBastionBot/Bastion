/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants, Logger, ModuleManagerEvent } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../utils/errors";

export = class CommandExecuteEvent extends ModuleManagerEvent {
    constructor() {
        super("commandExecute");
    }

    exec = async (command: Command, message: Message, status: Constants.MODULE_EXECUTE_STATUS, error?: Error): Promise<unknown> => {
        switch (status) {
        case "success":
            return;

        case "failed":
            if (error instanceof errors.DiscordError) {
                return message.channel.send({
                    embed: {
                        color: Constants.COLORS.RED,
                        title: error.name,
                        description: error.name === errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX
                            ? "That's not how you use the `" + command.name + "` command."
                            : error.message,
                        fields: error.name === errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX
                            ? [
                                {
                                    name: "Need help?",
                                    value: "```html\n" + command.name + " --help```\nYou can join [Bastion HQ](https://discord.gg/fzx8fkt) to get help from our amazing support staff.",
                                }
                            ]
                            : [],
                    },
                }).catch(Logger.error);
            }

            return message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: error.message,
                },
            }).catch(Logger.error);
        }
    }
}
