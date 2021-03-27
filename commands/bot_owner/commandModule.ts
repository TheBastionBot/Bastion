/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Collection, Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");

export = class CommandModuleCommand extends Command {
    constructor() {
        super("commandModule", {
            description: "It allows you to temporarily enable or disable a command module or cateogry until the next restart. It also allows you to check whether the command is currently enabled.",
            triggers: [ "command" ],
            arguments: {
                alias: {
                    category: [ "c" ],
                    disable: [ "d" ],
                    enable: [ "e" ],
                },
                boolean: [ "category", "disable", "enable" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "commandModule COMMAND",
                "commandModule COMMAND --disable",
                "commandModule COMMAND --enable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<any> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        if (argv.category && (argv.enable || argv.disable)) {
            // find the commands in the specified category
            const commands = (this.manager.modules as Collection<string, Command>).filter(command => command.category.toLowerCase() === argv._.join("").toLowerCase());

            // toggle commands' active status
            for (const [ , command ] of commands) {
                command.enabled = argv.enable ? true : argv.disable ? false : command.enabled;
            }

            // check whether the module exists
            if (!commands.size) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "commandNotFound"));

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: argv.enable ? Constants.COLORS.GREEN : argv.disable ? Constants.COLORS.RED : Constants.COLORS.PUPIL,
                    author: {
                        name: commands.first().category,
                    },
                    title: "Command Category",
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.enable ? "volatileCommandCateogoryEnable" : "volatileCommandCateogoryDisable", message.author.tag, commands.first().category),
                },
            }).catch(() => {
                // this error can be ignored.
            });
        }

        // find the specified command
        const command = (this.manager.modules as Collection<string, Command>).find(command => command.name.toLowerCase() === argv._.join("").toLowerCase());

        // check whether the command exists
        if (!command) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ERROR, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "commandNotFound"));

        // toggle command active status
        command.enabled = argv.enable ? true : argv.disable ? false : command.enabled;

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.enable ? Constants.COLORS.GREEN : argv.disable ? Constants.COLORS.RED : Constants.COLORS.PUPIL,
                author: {
                    name: command.name,
                },
                title: "Command Module",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.enable ? "volatileCommandEnable" : argv.disable ? "volatileCommandDisable" : command.enabled ? "commandEnabled" : "commandDisable", message.author.tag, command.name),
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
