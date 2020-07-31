/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as errors from "../../utils/errors";
import * as embeds from "../../utils/embeds";

export = class EchoCommand extends Command {
    constructor() {
        super("echo", {
            description: "It allows you to echo a message through Bastion. It also supports Bastion embed objects.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_MESSAGES" ],
            syntax: [
                "echo -- MESSAGE",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // command syntax validation
        if (!argv._.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        // validate input
        const rawData = argv._.join(" ");
        let embed: string | embeds.MessageEmbedData;
        try {
            embed = JSON.parse(rawData);

            if (!embeds.isValidBastionEmbed(embed as embeds.MessageEmbedData)) throw new Error("INVALID_BASTION_EMBED");
        } catch {
            embed = rawData;
        }

        // acknowledge
        await message.channel.send({
            embed: embeds.generateEmbed(embed),
        });
    }
}
