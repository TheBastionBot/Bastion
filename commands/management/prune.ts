/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message } from "discord.js";

import confirmation from "../../utils/confirmation";
import BastionGuild = require("../../structures/Guild");

export = class PruneCommand extends Command {
    constructor() {
        super("prune", {
            description: "It allows you to prune members without any roles, from the server, based on how long they have been inactive.",
            triggers: [],
            arguments: {
                alias: {
                    days: "d",
                },
                string: [ "days" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_GUILD" ],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "prune -- REASON",
                "prune --days NUMBER -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        const days = typeof argv.days === "number" ? Math.abs(argv.days) : 7;
        const reason = argv._.join(" ") || "-";

        // ask for confirmation
        const answer = await confirmation(message, this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "membersPruneQuestion", message.author.tag, days));
        if (!answer) return;


        // prune members
        await message.guild.members.prune({
            days: days,
            reason: reason,
        });

        // acknowledge
        return message.channel.send({
            embed: {
                color: Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "membersPrune", message.author.tag, days, reason),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
