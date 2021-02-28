/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as arrays from "../../utils/arrays";
import BastionGuild = require("../../structures/Guild");

export = class Languages extends Command {
    constructor() {
        super("languages", {
            description: "It allows you to see the languages available in Bastion and set one of them as the default language for your server.",
            triggers: [],
            arguments: {
                alias: {
                    set: [ "s" ],
                },
                string: [ "set" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "languages",
                "languages --set LANGUAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const guild = (message.guild as BastionGuild);

        // get the available locales
        const locales = this.client.locale.getLocales().map(l => l.toUpperCase());

        if (argv.set) {
            const language: string = argv.set.toUpperCase();

            // check whether the language is available
            if (!locales.includes(language)) {
                throw new Error(this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "languageUnavailable", language));
            }

            // set guild language
            guild.document.language = language.toLocaleLowerCase();

            // save document
            await guild.document.save();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "guildLanguageUpdate", message.author.tag, language.toUpperCase()),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.IRIS,
                title: "Available Languages",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "availableLocales"),
                fields: [
                    {
                        name: "Languages",
                        value: arrays.toBulletList(locales),
                    },
                ],
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
