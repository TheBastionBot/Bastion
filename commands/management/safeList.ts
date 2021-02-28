/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import GuildModel from "../../models/Guild";
import * as errors from "../../utils/errors";
import BastionGuild = require("../../structures/Guild");

export = class SafeListCommand extends Command {
    constructor() {
        super("safeList", {
            description: "It allows you to add members or roles to a safe list that prevents their messages from being filtered by invite filter or link filter in the server.",
            triggers: [],
            arguments: {
                boolean: [ "invite", "link", "delete" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [
                "safeList --invite",
                "safeList --invite CHANNEL | ROLE",
                "safeList --invite CHANNEL | ROLE --delete",
                "safeList --link",
                "safeList --link CHANNEL | ROLE",
                "safeList --link CHANNEL | ROLE --delete",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.invite) {
            // get the guild document
            const guildDocument = await GuildModel.findById(message.guild.id);

            if (argv._ && argv._.length) {
                const identifier = argv._.join(" ");

                // check whether the specified channel or role exists
                const channel = this.client.resolver.resolveGuildChannel(message.guild, identifier, [ "text", "news" ]);
                const role = this.client.resolver.resolveRole(message.guild, identifier);

                const entity = channel || role || undefined;

                if (!entity) throw new Error("ROLE_OR_CHANNEL_NOT_FOUND");

                const guildObject = guildDocument.toObject();

                // update the safe list entity
                if (argv.delete) {
                    if (guildObject.filters && guildObject.filters.inviteFilter && guildObject.filters.inviteFilter.whitelist) {

                        guildObject.filters.inviteFilter.whitelist = guildObject.filters.inviteFilter.whitelist.filter((e: string) => e !== entity.id);
                        if (!guildObject.filters.inviteFilter.whitelist.length) delete guildObject.filters.inviteFilter.whitelist;
                    }
                } else {
                    if (!guildObject.filters) guildObject.filters = {};
                    if (guildObject.filters.inviteFilter) {
                        if (guildObject.filters.inviteFilter.whitelist) guildObject.filters.inviteFilter.whitelist.push(entity.id);
                        else guildObject.filters.inviteFilter.whitelist = [ entity.id ];
                    } else {
                        guildObject.filters.inviteFilter = {
                            enabled: true,
                            whitelist: [ entity.id ],
                        };
                    }
                }

                // save document
                guildDocument.overwrite(guildObject);
                await guildDocument.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: argv.delete ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.delete ? "inviteFilterSafeListRemove" : "inviteFilterSafeListAdd", message.author.tag, entity.name),
                    },
                });
            }

            if (guildDocument.filters && guildDocument.filters.inviteFilter && guildDocument.filters.inviteFilter.whitelist) {
                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        title: "Invite Filter - Safe List",
                        description: guildDocument.filters.inviteFilter.whitelist.map(id => {
                            // check whether the specified channel or role exists
                            const channel = this.client.resolver.resolveGuildChannel(message.guild, id);
                            const role = this.client.resolver.resolveRole(message.guild, argv.role);

                            const entitity = channel || role || undefined;

                            return entitity ? entitity.name : id;
                        }).join(", "),
                    },
                });
            } else throw new Error("NO_INVITE_FILTER_SAFE_LIST_EXISTS");
        }

        if (argv.link) {
            // get the guild document
            const guildDocument = await GuildModel.findById(message.guild.id);

            if (argv._ && argv._.length) {
                const identifier = argv._.join(" ");

                // check whether the specified channel or role exists
                const channel = this.client.resolver.resolveGuildChannel(message.guild, identifier, [ "text", "news" ]);
                const role = this.client.resolver.resolveRole(message.guild, identifier);

                const entity = channel || role || undefined;

                if (!entity) throw new Error("ROLE_OR_CHANNEL_NOT_FOUND");

                const guildObject = guildDocument.toObject();

                // update the safe list entity
                if (argv.delete) {
                    if (guildObject.filters && guildObject.filters.linkFilter && guildObject.filters.linkFilter.whitelist) {

                        guildObject.filters.linkFilter.whitelist = guildObject.filters.linkFilter.whitelist.filter((e: string) => e !== entity.id);
                        if (!guildObject.filters.linkFilter.whitelist.length) delete guildObject.filters.linkFilter.whitelist;
                    }
                } else {
                    if (!guildObject.filters) guildObject.filters = {};
                    if (guildObject.filters.linkFilter) {
                        if (guildObject.filters.linkFilter.whitelist) guildObject.filters.linkFilter.whitelist.push(entity.id);
                        else guildObject.filters.linkFilter.whitelist = [ entity.id ];
                    } else {
                        guildObject.filters.linkFilter = {
                            enabled: true,
                            whitelist: [ entity.id ],
                        };
                    }
                }

                // save document
                guildDocument.overwrite(guildObject);
                await guildDocument.save();

                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: argv.delete ? Constants.COLORS.RED : Constants.COLORS.GREEN,
                        description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", argv.delete ? "linkFilterSafeListRemove" : "linkFilterSafeListAdd", message.author.tag, entity.name),
                    },
                });
            }

            if (guildDocument.filters && guildDocument.filters.linkFilter && guildDocument.filters.linkFilter.whitelist) {
                // acknowledge
                return await message.channel.send({
                    embed: {
                        color: Constants.COLORS.IRIS,
                        title: "Link Filter - Safe List",
                        description: guildDocument.filters.linkFilter.whitelist.map(id => {
                            // check whether the specified channel or role exists
                            const channel = this.client.resolver.resolveGuildChannel(message.guild, id);
                            const role = this.client.resolver.resolveRole(message.guild, argv.role);

                            const entitity = channel || role || undefined;

                            return entitity ? entitity.name : id;
                        }).join(", "),
                    },
                });
            } else throw new Error("NO_LINK_FILTER_SAFE_LIST_EXISTS");
        }

        // Command Syntax Validation
        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.INVALID_COMMAND_SYNTAX, this.name);
    }
}
