/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import * as strings from "../../utils/strings";

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
            typing: true,
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
                    description: this.client.locale.getString("en_us", "info", "commandSearchFound", filteredCommands.length.toString(), argv.search),
                    fields: [
                        {
                            name: "Commands",
                            value: "```\n" + filteredCommands.slice(0, 10).join("\n") + "```",
                        },
                        {
                            name: "Want the complete list?",
                            value: this.client.locale.getString("en_us", "info", "commandsWebsite"),
                        },
                    ],
                    footer: {
                        text: this.client.locale.getString("en_us", "info", "didYouKnowCommandsCount", this.manager.modules.size),
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
                        description: this.client.locale.getString("en_us", "info", "commandCategoriesCommand", Object.keys(commands).length),
                        fields: [
                            {
                                name: "Commands",
                                value: "```css\n" + commands[category].join("\n") + "```",
                            },
                            {
                                name: "Need more details?",
                                value: this.client.locale.getString("en_us", "info", "commandDetailsOption")
                                    + "```bash\ncommands --help```",
                            },
                        ],
                        footer: {
                            text: this.client.locale.getString("en_us", "info", "didYouKnowCommandsCount", this.manager.modules.size),
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
                description: this.client.locale.getString("en_us", "info", "categoryCommandsCommand"),
                fields: [
                    {
                        name: "Command Categories",
                        value: "```css\n" + Object.keys(commands).map(c => strings.snakeToTitleCase(c)).join("\n") + "```",
                    },
                    {
                        name: "Want the complete list?",
                        value: this.client.locale.getString("en_us", "info", "commandsWebsite"),
                    },
                ],
                footer: {
                    text: this.client.locale.getString("en_us", "info", "didYouKnowCommandsCount", this.manager.modules.size),
                },
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
