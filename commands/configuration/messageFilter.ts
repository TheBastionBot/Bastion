/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import * as arrays from "../../utils/arrays";
import BastionGuild = require("../../structures/Guild");

export = class MessageFilterCommand extends Command {
    constructor() {
        super("messageFilter", {
            description: "It allows you to enable (and disable) Message Filter in the server. When enabled, it filters the messages that matches the patterns specified by you. And it also allows you to configure if violation of this filter should be considered an infraction.",
            triggers: [],
            arguments: {
                alias: {
                    clear: [ "c" ],
                    disable: [ "d" ],
                    enable: [ "e" ],
                    infraction: [ "i" ],
                    list: [ "l" ],
                },
                boolean: [ "clear", "disable", "enable", "infraction", "list" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "messageFilter",
                "messageFilter PATTERN",
                "messageFilter --clear",
                "messageFilter --enable",
                "messageFilter --disable",
                "messageFilter --infraction",
                "messageFilter --no-infraction",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update message filter patterns
        const pattern = argv._.length ? [ argv._.join(" ") ] : [];

        // update message filter settings
        guild.document.filters = {
            ...guild.document.filters,
            messageFilter: {
                enabled: argv.disable ? undefined : argv.enable || guild.document.filters && guild.document.filters.messageFilter && guild.document.filters.messageFilter.enabled ? true : undefined,
                patterns: argv.clear
                    ?   undefined
                    :   guild.document.filters && guild.document.filters.messageFilter && guild.document.filters.messageFilter.patterns
                        ? pattern.length ? guild.document.filters.messageFilter.patterns.concat(pattern) : guild.document.filters.messageFilter.patterns
                        : pattern.length ? pattern : undefined,
                infraction: argv.infraction === false ? undefined : argv.infraction || guild.document.filters && guild.document.filters.messageFilter && guild.document.filters.messageFilter.infraction ? true : undefined,
            },
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.enable ? Constants.COLORS.GREEN : argv.disable ? Constants.COLORS.RED : Constants.COLORS.IRIS,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.enable ? "messageFilterEnable" : argv.disable ? "messageFilterDisable" : guild.document.filters.messageFilter.enabled ? "messageFilterEnabled" : "messageFilterDisabled", message.author.tag),
                fields: guild.document.filters.messageFilter.enabled || pattern.length ? [
                    {
                        name: pattern.length ? "Filter Pattern Added" : "Filter Patterns",
                        value: pattern.length ? pattern[0] : guild.document.filters.messageFilter.patterns ? arrays.wrap(guild.document.filters.messageFilter.patterns, "`").join(", ") : "-",
                    },
                ] : [],
                footer: {
                    text: guild.document.filters.messageFilter.enabled ? this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.filters.messageFilter.infraction ? "filterInfractionEnabled" : "filterInfractionDisabled") : "",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
