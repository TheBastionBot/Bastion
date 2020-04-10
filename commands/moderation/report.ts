/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "tesseract";
import { Message, TextChannel } from "discord.js";

import * as errors from "../../utils/errors";

import BastionGuild = require("../../structures/Guild");

export = class Report extends Command {
    constructor() {
        super("report", {
            description: "It allows you to report a server member to the moderators of the server, provided a Report Channel is set.",
            triggers: [],
            arguments: {
                alias: {
                    user: "u",
                },
                string: [ "user" ],
            },
            scope: "guild",
            owner: false,
            typing: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "report --user USER_ID -- REASON",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        // Resolve user
        const user = this.client.resolver.resolveUser(argv.user);

        // Reason
        const reason = argv._.join(" ");

        // Command Syntax Validation
        if (!user || !reason) throw new errors.CommandSyntaxError(this.name);


        if ((message.guild as BastionGuild).document.reportsChannelId) {
            // Report User
            await (message.guild.channels.cache.get((message.guild as BastionGuild).document.reportsChannelId) as TextChannel).send({
                embed: {
                    color: Constants.COLORS.ORANGE,
                    title: "User Report",
                    fields: [
                        {
                            name: "User",
                            value: `${user.tag} / ${user.id}`,
                        },
                        {
                            name: "Report",
                            value: reason,
                        },
                    ],
                    footer: {
                        text: `Reported by ${message.author.tag} / ${message.author.id}`,
                    },
                },
            });

            // Acknowledgement
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.ORANGE,
                    description: this.client.locale.getString("en_us", "info", "reportConfirmation", message.author.tag),
                },
            }).catch(() => {
                // This error can be ignored.
            });

            // Delete the report command
            if (message.deletable) await message.delete({ reason: "User Report Command" }).catch(() => {
                // This error can be ignored.
            });
        } else {
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString("en_us", "errors", "noReportChannel"),
                },
            }).catch(() => {
                // This error can be ignored.
            });
        }
    }
}
