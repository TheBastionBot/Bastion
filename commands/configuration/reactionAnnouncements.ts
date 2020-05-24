/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, Constants } from "tesseract";
import { Message } from "discord.js";

import BastionGuild = require("../../structures/Guild");

export = class ReactionAnnouncementsCommand extends Command {
    constructor() {
        super("reactionAnnouncements", {
            description: "It allows you to enable (and disable) Reaction Announcements in the server. If enabled, and an Announcement Channel is set, when someone with proper permission adds a Megaphone or Loudspeaker reaction to a message, the message gets announced in the Announcement Channel.",
            triggers: [],
            arguments: {},
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [],
            userPermissions: [ "MANAGE_GUILD" ],
            syntax: [],
        });
    }

    exec = async (message: Message): Promise<void> => {
        const guild = (message.guild as BastionGuild);

        // update the announcement channel
        if (guild.document.reactionAnnouncements) {
            guild.document.reactionAnnouncements = undefined;
            delete guild.document.reactionAnnouncements;
        } else {
            guild.document.reactionAnnouncements = true;
        }

        // save document
        await guild.document.save();

        // acknowledge
        await message.channel.send({
            embed: {
                color: guild.document.reactionAnnouncements ? Constants.COLORS.GREEN : Constants.COLORS.RED,
                description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", guild.document.reactionAnnouncements ? "reactionAnnouncementsEnable" : "reactionAnnouncementsDisable", message.author.tag)
                    + (guild.document.announcementsChannelId ? "" : this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "reactionAnnouncementsEnableWithoutAnnouncementChannel", message.author.tag)),
            },
        }).catch(() => {
            // This error can be ignored.
        });
    }
}
