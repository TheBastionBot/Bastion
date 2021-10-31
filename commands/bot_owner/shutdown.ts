/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionUser = require("../../structures/User");
import BastionGuild = require("../../structures/Guild");

export = class Shutdown extends Command {
    constructor() {
        super("shutdown", {
            description: "It allows you to shutdown Bastion directly from Discord.",
            triggers: [],
            arguments: {
                boolean: [ "now" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "shutdown",
                "shutdown --now",
            ],
        });
    }

    shutdown = (): Promise<unknown[]> => {
        return this.client.shard.broadcastEval("this.destroy();process.exitCode = 0;");
    };

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // instant shutdown
        if (argv.now) {
            return await this.shutdown();
        }

        // ask for confirmation
        const question = await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "shutdownQuestion", message.author.tag),
            },
        });

        await question.react("☑️");
        await question.react("🚫");

        const reactions = await question.awaitReactions((reaction, user: BastionUser) => user.isOwner() && (reaction.emoji.name === "☑️" || reaction.emoji.name === "🚫"), {
            max: 1,
            time: 6e4,
        });

        if (reactions.size && reactions.first().emoji.name === "☑️") {
            // shutdown
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.PUPIL,
                    description: "Sayonara!",
                },
            }).catch(() => {
                // this error can be ignored.
            });

            await this.shutdown();
        }
    };
}
