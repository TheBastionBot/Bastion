/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as strings from "../../utils/strings";
import BastionGuild = require("../../structures/Guild");

export = class Commands extends Command {
    constructor() {
        super("commands", {
            description: "It allows you the see the list of commands available in Bastion. You can also use it to search for commands matching a given query.",
            triggers: [],
            arguments: {
                alias: {
                    search: [ "s" ],
                },
                string: [ "search" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "commands",
                "commands CATEGORY",
                "commands --search QUERY",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.search) {
            const filteredCommands = this.manager.modules
                .map(c => c.name)
                .filter(c => c.toLowerCase().includes(argv.search.toLowerCase()));

            // list all the matched command
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.YELLOW,
                    author: {
                        name: this.client.locale.getConstant("bastion.name"),
                        url: this.client.locale.getConstant("bastion.website"),
                    },
                    title: "Command Search",
                    url: this.client.locale.getConstant("bastion.website") + "/commands",
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandSearchFound", filteredCommands.length.toString(), argv.search),
                    fields: [
                        {
                            name: "Commands",
                            value: "```\n" + filteredCommands.slice(0, 10).join("\n") + "```",
                        },
                        {
                            name: "Want the complete list?",
                            value: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandsWebsite"),
                        },
                    ],
                    footer: {
                        text: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowCommandsCount", this.manager.modules.size),
                    },
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }


        // organize commands into categories
        const commands: { [category: string]: string[] } = {};

        for (const command of this.manager.modules.values()) {
            if (command.category in commands) {
                commands[command.category].push(command.name);
            } else {
                commands[command.category] = [ command.name ];
            }
        }


        // list all commands in the specified command category
        if (argv._.length) {
            const category = strings.toSnakeCase(argv._.join(" "));

            if (Object.keys(commands).includes(category)) {
                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.YELLOW,
                        author: {
                            name: this.client.locale.getConstant("bastion.name"),
                            url: this.client.locale.getConstant("bastion.website"),
                        },
                        title: "Commands in " + strings.snakeToTitleCase(category) + " Category",
                        url: this.client.locale.getConstant("bastion.website") + "/commands",
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandCategoriesCommand", Object.keys(commands).length),
                        fields: [
                            {
                                name: "Commands",
                                value: "```css\n" + commands[category].join("\n") + "```",
                            },
                            {
                                name: "Need more details?",
                                value: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandDetailsOption")
                                    + " For example:```bash\n" + this.client.configurations.prefixes[0] + this.manager.modules.filter(m => m.category === category).randomKey() + " --help```",
                            },
                        ],
                        footer: {
                            text: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowCommandsCount", this.manager.modules.size),
                        },
                    },
                }).catch(() => {
                    // This error can be ignored.
                });
            }

            // invalid command category
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.YELLOW,
                    description: strings.snakeToTitleCase(category) + " is an invalid command category. Use the `commands` command without any arguments to get a list of all the available command categories.",
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }

        // list all the command categories
        await message.channel.send({
            embed: {
                color: Constants.COLORS.YELLOW,
                author: {
                    name: this.client.locale.getConstant("bastion.name"),
                    url: this.client.locale.getConstant("bastion.website"),
                },
                title: "Command Categories",
                url: this.client.locale.getConstant("bastion.website") + "/commands",
                description: "```css\n" + Object.keys(commands).map(c => strings.snakeToTitleCase(c)).join("\n") + "```\n"
                    + this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "categoryCommandsCommand")
                    + " For example:```bash\n" + this.client.configurations.prefixes[0] + "commands " + this.manager.modules.random().category + "```\n",
                fields: [
                    {
                        name: "Want the complete list?",
                        value: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "commandsWebsite"),
                    },
                ],
                footer: {
                    text: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "didYouKnowCommandsCount", this.manager.modules.size),
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    };
}
