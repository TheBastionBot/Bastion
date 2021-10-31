/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import GuildModel from "../../models/Guild";
import * as numbers from "../../utils/numbers";

import BastionGuild = require("../../structures/Guild");
import BastionGuildMember = require("../../structures/GuildMember");

export = class InfractionsCommand extends Command {
    constructor() {
        super("infractions", {
            description: "It allows you to list all your infractions. If you're a server manager, it also allows you to set the thresholds for the actions that should be taken for violating infractions.",
            triggers: [],
            arguments: {
                coerce: {
                    kick: (arg): number => Math.floor(numbers.clamp(arg, 1, 256)),
                    ban: (arg): number => Math.floor(numbers.clamp(arg, 1, 256)),
                },
                number: [ "kick", "ban" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "infractions",
                "infractions --kick 5",
                "infractions --ban 10",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.kick || argv.ban) {
            // check whether member has permission to manage server
            if (!message.member.permissions.has("MANAGE_GUILD")) throw new Error("NO_PERMISSION");

            // get guild document
            const guildDocument = await GuildModel.findById(message.guild.id);

            // update infractions
            guildDocument.infractions = {
                ...guildDocument.infractions,
                kickThreshold: argv.kick ? argv.kick : guildDocument.infractions && guildDocument.infractions.kickThreshold ? guildDocument.infractions.kickThreshold : undefined,
                banThreshold: argv.ban ? argv.ban : guildDocument.infractions && guildDocument.infractions.banThreshold ? guildDocument.infractions.banThreshold : undefined,
            };

            // save document
            await guildDocument.save();

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "infractionThreshold", message.author.tag),
                    fields: [
                        {
                            name: "Kick Threshold",
                            value: guildDocument.infractions && guildDocument.infractions.kickThreshold ? guildDocument.infractions.kickThreshold : "-",
                            inline: true,
                        },
                        {
                            name: "Ban Threshold",
                            value: guildDocument.infractions && guildDocument.infractions.banThreshold ? guildDocument.infractions.banThreshold : "-",
                            inline: true,
                        },
                    ],
                },
            });
        }

        // acknowledge
        await message.channel.send({
            embed: {
                color: (message.member as BastionGuildMember).document.infractions && (message.member as BastionGuildMember).document.infractions.length ? Constants.COLORS.ORANGE : Constants.COLORS.GREEN,
                author: {
                    name: message.author.tag,
                },
                title: "Infractions",
                description: (message.member as BastionGuildMember).document.infractions && (message.member as BastionGuildMember).document.infractions.length ? (message.member as BastionGuildMember).document.infractions.join("\n") : "You haven't caused any trouble, yet. Keep it up!",
            },
        }).catch(() => {
            // this error can be ignored
        });
    };
}
