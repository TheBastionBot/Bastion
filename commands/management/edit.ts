/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as embeds from "../../utils/embeds";
import BastionGuild = require("../../structures/Guild");

export = class EditCommand extends Command {
    constructor() {
        super("edit", {
            description: "It allows you to edit any message sent by Bastion in the current channel.",
            triggers: [],
            arguments: {
                alias: {
                    message: [ "m" ],
                },
                string: [ "message" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "ADMINISTRATOR" ],
            syntax: [
                "edit --message MESSAGE_ID -- NEW MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv.message || !argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // fetch the specified message
        const messageObject = await message.channel.messages.fetch(argv.message, false);

        // check whether the message exists.
        if (!messageObject) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

        // check whether the message is editable
        if (!messageObject.editable) return;

        // validate input
        const rawData = argv._.join(" ");
        let embed: string | embeds.MessageEmbedData;
        try {
            embed = JSON.parse(rawData);

            if (!embeds.isValidBastionEmbed(embed as embeds.MessageEmbedData)) throw new Error("INVALID_BASTION_EMBED");
        } catch {
            embed = rawData;
        }

        // edit the message
        await messageObject.edit({
            embed: {
                ...embeds.generateEmbed(embed),
                footer: {
                    text: "Edited by " + message.author.tag,
                },
            },
        });

        // acknowledge
        await message.react("✅");
    }
}
