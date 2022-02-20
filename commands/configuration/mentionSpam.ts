/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class MentionSpamCommand extends Command {
    constructor() {
        super("mentionSpam", {
            description: "It allows you to set (and unset) the threshold for mention spam in the server. If set, Bastion will warn the users who violate this and add it to their infractions.",
            triggers: [],
            arguments: {
                alias: {
                    threshold: [ "t" ],
                },
                number: [ "threshold" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "mentionSpam",
                "mentionSpam --threshold NUMBER",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update mention spam settings
        guild.document.mentionSpam = {
            ...guild.document.mentionSpam?.toJSON(),
            threshold: typeof argv.threshold === "number" && argv.threshold > 1 ? argv.threshold : undefined,
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.mentionSpam.threshold ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.mentionSpam.threshold ? "mentionSpamInfractionsEnable" : "mentionSpamInfractionsDisable", message.author.tag, guild.document.mentionSpam.threshold),
            },
        }).catch(() => {
            // this error can be ignored
        });
    };
}
