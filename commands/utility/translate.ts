/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import translate = require("@iamtraction/google-translate");

import * as errors from "../../utils/errors";

export = class TranslateCommand extends Command {
    constructor() {
        super("translate", {
            description: "It allows you to translate the specified text from one language to another.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "translate -- TEXT",
                "translate --to LANGUAGE -- TEXT",
                "translate --from LANGUAGE --to LANGUAGE -- TEXT",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // identify the text to translate
        const text: string = argv._.join(" ");
        // identify the source language
        const from: string = argv.from ? argv.from.toLowerCase() : "auto";
        // identify the source language
        const to: string = argv.to ? argv.to.toLowerCase() : "en";

        // fetch the translation
        const response = await translate(text, { from, to });

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Translation",
                description: response.text,
                fields: [
                    {
                        name: "Source Language",
                        value: response.from.language.iso.toUpperCase(),
                        inline: true,
                    },
                    {
                        name: "Target Language",
                        value: to.toUpperCase(),
                        inline: true,
                    },
                ],
                footer: {
                    text: "Powered by Google",
                },
            },
        });
    }
}
