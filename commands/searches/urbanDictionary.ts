/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";

interface UrbanDictionaryDefinition {
    definition: string;
    permalink: string;
    thumbs_up: number;
    word: string;
    thumbs_down: number;
    written_on: string;
    example: string;
}

export = class UrbanDictionaryCommand extends Command {
    constructor() {
        super("urbanDictionary", {
            description: "It allows you to search the Urban Dictionary for definitions of the specified word.",
            triggers: [ "ud" ],
            arguments: {},
            scope: "guild",
            owner: false,
            nsfw: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "urbanDictionary WORD",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the word
        const word = argv._.join(" ");

        const response = await omnic.makeRequest("/urbandictionary/definitions/" + encodeURIComponent(word));

        const definitions: { list: UrbanDictionaryDefinition[] } = await response.json();

        // check if definitions exist
        if (!definitions || !definitions.list || !definitions.list.length) throw new Error("NO_DEFINITIONS_FOUND");

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                author: {
                    name: "Urban Dictionary",
                    url: "https://urbandictionary.com",
                },
                title: definitions.list[0].word,
                url: definitions.list[0].permalink,
                description: definitions.list[0].definition,
                fields: [
                    {
                        name: "Examples",
                        value: definitions.list[0].example,
                    },
                    {
                        name: "Upvotes",
                        value: definitions.list[0].thumbs_up,
                        inline: true,
                    },
                    {
                        name: "Downvotes",
                        value: definitions.list[0].thumbs_down,
                        inline: true,
                    },
                ],
                footer: {
                    text: "Powered by Urban Dictionary",
                },
                timestamp: new Date(definitions.list[0].written_on),
            },
        });
    }
}
