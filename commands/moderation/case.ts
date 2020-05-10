/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message, NewsChannel, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";

import * as numbers from "../../utils/numbers";
import CaseModel from "../../models/Case";
import BastionGuild = require("../../structures/Guild");

export = class CaseCommand extends Command {
    constructor() {
        super("case", {
            description: "It allows you to see the moderation case log for the specified case number.",
            triggers: [],
            arguments: {
                alias: {
                    number: "n",
                },
                number: [ "number" ],
                coerce: {
                    number: (arg): number => Math.floor(numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER)),
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "case --number NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // Command Syntax Validation
        if (!argv.number) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const moderationCase = await CaseModel.findOne({
            guild: message.guild.id,
            number: argv.number,
        });

        if (!moderationCase) throw new Error(this.client.locale.getString("en_us", "errors", "caseNotFound"));

        const channelsPool = message.guild.channels.cache.filter(c => c.type === "text" || c.type === "news");

        if ((message.guild as BastionGuild).document.moderationLogChannelId && channelsPool.has((message.guild as BastionGuild).document.moderationLogChannelId)) {
            const moderationLogChannel = channelsPool.get((message.guild as BastionGuild).document.moderationLogChannelId);

            if (moderationLogChannel instanceof NewsChannel || moderationLogChannel instanceof TextChannel) {
                const moderationLogMessage = await moderationLogChannel.messages.fetch(moderationCase.messageId);

                // send the moderation case message
                await message.channel.send({
                    embed: moderationLogMessage.embeds[0],
                });
            }
        }
    }
}
