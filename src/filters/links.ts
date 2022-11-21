/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Filter, Logger } from "@bastion/tesseract";
import { Message, PermissionFlagsBits } from "discord.js";

import GuildModel from "../models/Guild";
import { logModerationEvent } from "../utils/guilds";
import { addInfraction } from "../utils/members";
import * as regex from "../utils/regex";

class LinkFilter extends Filter {
    constructor() {
        super("links");
    }

    public async exec(message: Message<boolean>): Promise<boolean> {
        if (!message.inGuild()) return;
        if (!message.content?.length) return;

        // check whether the member has permission to manage channel or manage messages
        if (message.channel.permissionsFor(message.member).has(PermissionFlagsBits.ManageMessages)) return false;

        const guildDocument = await GuildModel.findById(message.guildId);

        // check whether link filter is enabled
        if (!guildDocument?.linkFilter) return false;

        // check whether any whitelist exists
        if (guildDocument.linkFilterExemptions?.length) {
            // check whether the channel is whitelisted
            if (guildDocument.linkFilterExemptions.includes(message.channel.id)) return false;

            // check whether any of the member's roles are whitelisted
            if (guildDocument.linkFilterExemptions.some(id => message.member.roles.cache.has(id))) return false;
        }

        // check whether the message has an uri
        if (regex.URI.test(message.content)) {
            // add infraction
            addInfraction(message.member, "Link Filter").catch(Logger.error);

            // create moderation log
            logModerationEvent(message.guild, {
                title: "Link Filtered",
                fields: [
                    {
                        name: "User",
                        value: message.author.tag,
                    },
                    {
                        name: "ID",
                        value: message.author.id,
                    },
                    {
                        name: "Channel",
                        value: message.channel.toString(),
                    },
                ],
            }).catch(Logger.ignore);

            return true;
        }

        return false;
    }
}

export = LinkFilter;
