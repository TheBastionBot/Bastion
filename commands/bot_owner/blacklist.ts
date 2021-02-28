/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants, Snowflake } from "@bastion/tesseract";
import { Message, EmbedField } from "discord.js";

import ConfigModel from "../../models/Config";
import * as arrays from "../../utils/arrays";
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

        const fields: EmbedField[] = [];

        // update blacklisted guilds
        if (argv.remove) config.blacklistedGuildIds = config.blacklistedGuildIds.filter(id => !servers.includes(id));
        else config.blacklistedGuildIds = [ ...servers, ...config.blacklistedGuildIds ];

        config.blacklistedGuildIds = [ ...new Set(config.blacklistedGuildIds) ];

        const resultingServers = arrays.toBulletList(config.blacklistedGuildIds);

        if (resultingServers) {
            fields.push({
                name: "Servers",
                value: resultingServers,
                inline: true,
            });
        }

        // update blacklisted users
        if (argv.remove) config.blacklistedUserIds = config.blacklistedUserIds.filter(id => !users.includes(id));
        else config.blacklistedUserIds = [ ...users, ...config.blacklistedUserIds ];

        config.blacklistedUserIds = [ ...new Set(config.blacklistedUserIds) ];

        const resultingUsers = arrays.toBulletList(config.blacklistedUserIds);

        if (resultingUsers) {
            fields.push({
                name: "Users",
                value: resultingUsers,
                inline: true,
            });
        }


        // save config document
        await config.save();


        // acknowledge
        await message.channel.send({
            embed: {
                color: Constants.COLORS.PUPIL,
                title: "Bastion's Blacklist",
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", (servers.length || users.length) ? "bastionBlacklistUpdate" : "bastionBlacklistUnchanged", message.author.tag),
                fields,
                footer: {
                    text: `${config.blacklistedGuildIds.length} Blacklisted Servers / ${config.blacklistedUserIds.length} Blacklisted Users`,
                },
            },
        });
    }
}
