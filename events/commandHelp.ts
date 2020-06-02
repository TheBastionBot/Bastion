/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants, Logger, ModuleManagerEvent } from "tesseract";
import { Message } from "discord.js";

import * as arrays from "../utils/arrays";
import * as strings from "../utils/strings";

export = class CommandHelpEvent extends ModuleManagerEvent {
    constructor() {
        super("commandHelp");
    }

    exec = async (message: Message, command: Command): Promise<void> => {
        message.channel.send({
            embed: {
                color: Constants.COLORS.YELLOW,
                fields: [
                    {
                        name: "Command",
                        value: `\`${command.name}\``,
                        inline: true
                    },
                    {
                        name: "Aliases",
                        value: command.triggers.length ? arrays.wrap(command.triggers, "`").join("\n") : "-",
                        inline: true
                    },
                    {
                        name: "Category",
                        value: strings.snakeToTitleCase(command.category),
                        inline: true
                    },
                    {
                        name: "Description",
                        value: command.description || "-",
                    },
                    {
                        name: "Bastion Permissions",
                        value: command.clientPermissions.length ? command.clientPermissions.map(c => strings.snakeToTitleCase(c.toString())).join("\n") : "-",
                        inline: true
                    },
                    {
                        name: "Human Permissions",
                        value: command.owner ? "Bot Owner" : command.userPermissions.length ? command.userPermissions.map(c => strings.snakeToTitleCase(c.toString())).join("\n") : "-",
                        inline: true
                    },
                    {
                        name: "Syntax",
                        value: command.syntax.length ? arrays.wrap(command.syntax, "```").join("") : "```" + command.name  + "```",
                    },
                ],
            },
        }).catch(Logger.error);
    }
}
