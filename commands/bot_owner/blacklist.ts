/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants, Snowflake } from "tesseract";
import { Message, EmbedField } from "discord.js";

import ConfigModel from "../../models/Config";
import * as arrays from "../../utils/arrays";
import * as errors from "../../utils/errors";
import * as snowflake from "../../utils/snowflake";
import BastionGuild = require("../../structures/Guild");

export = class Blacklist extends Command {
    constructor() {
        super("blacklist", {
            description: "It allows you to blacklist users and servers that. Blacklisted servers and users don't have access to Bastion's commands.",
            triggers: [],
            arguments: {
                array: [ "servers", "users" ],
                boolean: [ "remove" ],
                string: [ "servers", "users" ],
            },
            scope: "guild",
            owner: true,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [],
            syntax: [
                "blacklist --users USER_ID",
                "blacklist --servers SERVER_ID",
                "blacklist --users USER_ID --remove",
                "blacklist --servers SERVER_ID --remove",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<void> => {
        const config = await ConfigModel.findById(this.client.user.id);

        const servers: Snowflake[] = argv.servers ? argv.servers.filter((id: string) => snowflake.isValid(id)) : [];
        const users: Snowflake[] = argv.users ? argv.users.filter((id: string) => snowflake.isValid(id)) : [];

        // command syntax validation
        if (!servers.length && !users.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);

        const fields: EmbedField[] = [];

        // update blacklisted guilds
        if (servers.length) {
            if (argv.remove) config.blacklistedGuildIds = config.blacklistedGuildIds.filter(id => !servers.includes(id));
            else config.blacklistedGuildIds = [ ...users, ...config.blacklistedGuildIds ];

            config.blacklistedGuildIds = [ ...new Set(config.blacklistedGuildIds) ];

            fields.push({
                name: "Servers",
                value: arrays.toBulletList(servers),
                inline: true,
            });
        }
        // update blacklisted users
        if (servers.length) {
            if (argv.remove) config.blacklistedUserIds = config.blacklistedUserIds.filter(id => !users.includes(id));
            else config.blacklistedUserIds = [ ...users, ...config.blacklistedUserIds ];

            config.blacklistedUserIds = [ ...new Set(config.blacklistedUserIds) ];

            fields.push({
                name: "Users",
                value: arrays.toBulletList(users),
                inline: true,
            });
        }

        config.save();


        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                title: "Bastion's Blacklist",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", servers.length || users.length ? "bastionBlacklistUpdate" : "bastionBlacklistUnchanged", message.author.tag),
                fields,
                footer: {
                    text: `${config.blacklistedGuildIds.length} Blacklisted Servers / ${config.blacklistedUserIds.length} Blacklisted Users`,
                },
            },
        }).catch(() => {
            // this error can be ignored.
        });
    }
}
