/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class InviteFilterCommand extends Command {
    constructor() {
        super("inviteFilter", {
            description: "It allows you to enable (and disable) Invite Filter in the server. And it also allows you to configure if violation of this filter should be considered an infraction.",
            triggers: [],
            arguments: {
                alias: {
                    disable: [ "d" ],
                    enable: [ "e" ],
                    infraction: [ "i" ],
                },
                boolean: [ "disable", "enable", "infraction" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "inviteFilter",
                "inviteFilter --enable",
                "inviteFilter --disable",
                "inviteFilter --infraction",
                "inviteFilter --no-infraction",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update invite filter settings
        guild.document.filters = {
            ...guild.document.filters,
            inviteFilter: {
                enabled: argv.disable ? undefined : argv.enable || guild.document.filters && guild.document.filters.inviteFilter && guild.document.filters.inviteFilter.enabled ? true : undefined,
                infraction: argv.infraction === false ? undefined : argv.infraction || guild.document.filters && guild.document.filters.inviteFilter && guild.document.filters.inviteFilter.infraction ? true : undefined,
                whitelist: (guild.document.filters && guild.document.filters.inviteFilter && guild.document.filters.inviteFilter.whitelist) ?? undefined,
            },
        };

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: argv.enable ? Constants.COLORS.GREEN : argv.disable ? Constants.COLORS.RED : Constants.COLORS.IRIS,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.enable ? "inviteFilterEnable" : argv.disable ? "inviteFilterDisable" : guild.document.filters.inviteFilter.enabled ? "inviteFilterEnabled" : "inviteFilterDisabled", message.author.tag),
                footer: {
                    text: guild.document.filters.inviteFilter.enabled ? this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.filters.inviteFilter.infraction ? "filterInfractionEnabled" : "filterInfractionDisabled") : "",
                },
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
