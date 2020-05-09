/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments } from "tesseract";
import { Message, NewsChannel, TextChannel } from "discord.js";

import CaseModel from "../../models/Case";
import BastionGuild = require("../../structures/Guild");
import * as numbers from "../../utils/numbers";
import * as errors from "../../utils/errors";

export = class ReasonCommand extends Command {
    constructor() {
        super("reason", {
            description: "It allows you to update the reason of a moderation case. Forgot to set a reason? Did a typo? Here's your second chance.",
            triggers: [],
            arguments: {
                alias: {
                    case: "n",
                },
                number: [ "case" ],
                coerce: {
                    case: (arg): number => Math.floor(numbers.clamp(arg, 1, Number.MAX_SAFE_INTEGER)),
                },
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "reason --case NUMBER -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        // check whether the member is likely to be the moderator for this case
        if (message.author.id !== message.guild.ownerID || message.member.roles.cache.size < 2) return;

        // Command Syntax Validation
        if (!argv.number || !argv._.length) throw new errors.CommandSyntaxError(this.name);

        // find the moderation case
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
                const messageEmbed = moderationLogMessage.embeds[0];

                // check whether the message author is the responsible moderator for this case or has the permission to manage the server
                if (!message.member.permissions.has("MANAGE_GUILD") || messageEmbed.fields.find(f => f.name === "Moderator ID").value !== message.author.id) return;

                // update the moderation case's reason
                messageEmbed.fields.find(f => f.name === "Reason").value = argv._.join(" ");

                // send the moderation case message
                await moderationLogMessage.edit({
                    embed: messageEmbed,
                });
            }
        }
    }
}
