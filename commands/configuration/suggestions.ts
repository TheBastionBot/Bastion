/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class Suggestions extends Command {
    constructor() {
        super("suggestions", {
            description: "It allows you to enable (and disable) suggestions in the server. It sets the channel as the Suggestion Channel that will receive the suggestions, suggested by the server members using the `suggest` command.",
            triggers: [],
            arguments: {
                alias: {
                    disable: [ "d" ],
                },
                boolean: [ "disable" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "suggestions",
                "suggestions --disable",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the suggestion channel
        if (argv.disable) {
            guild.document.suggestionsChannelId = undefined;
            delete guild.document.suggestionsChannelId;
        } else {
            guild.document.suggestionsChannelId = message.channel.id;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.suggestionsChannelId ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.suggestionsChannelId ? "suggestionsEnable" : "suggestionsDisable", message.author.tag),
                fields: [
                    {
                        name: "Collect and track suggestions more effectively.",
                        value: "Checkout [**Glee**](https://glee.traction.one). The best way to collect user feedback.",
                    },
                ],
            },
        });
    };
}
