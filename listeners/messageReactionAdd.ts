/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember, MessageReaction, TextChannel, User } from "discord.js";

import ReactionRoleGroup from "../models/ReactionRoleGroup";
import RoleModel from "../models/Role";
import BastionGuild = require("../structures/Guild");
import * as emojis from "../utils/emojis";

export = class MessageReactionAddListener extends Listener {
    constructor() {
        super("messageReactionAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    handleReactionPinning = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // check whether the reaction was of a pin
        if (![ "📌", "📍" ].includes(messageReaction.emoji.name)) return;
        // check whether the member has permission to pin messages
        if (!(messageReaction.message.channel as TextChannel).permissionsFor(member).has("MANAGE_MESSAGES")) return;

        // pin the message
        await messageReaction.message.pin();
    }

    handleReactionRoles = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // identify the reaction roles group for the reaction
        const reactionRolesGroup = await ReactionRoleGroup.findById(messageReaction.message.id);

        if (!reactionRolesGroup) return;

        // build the reaction emoji
        const emoji = messageReaction.emoji.id
            ? "<" + (messageReaction.emoji.animated ? "a" : "") + ":" + messageReaction.emoji.name + ":" + messageReaction.emoji.id + ">"
            : messageReaction.emoji.name;

        const emojiObject = emojis.parseEmoji(emoji);

        if (emojiObject) {
            // find the role for this emoji in the reaction roles group
            const reactionRole = await RoleModel.findOne({
                $or: reactionRolesGroup.roles.map(id => ({ _id: id })),
                guild: messageReaction.message.guild.id,
                emoji: emojiObject.value,
            });

            if (!reactionRole) return;

            // remove all other roles in this reaction roles group, if the roles are mutually exclusive
            if (reactionRolesGroup.exclusive) {
                await member.roles.remove(reactionRolesGroup.roles, "Auto Removed via Reaction Roles");
            }

            // add the reaction role
            await member.roles.add(reactionRole._id, "Added via Reaction Roles");
        }
    }

    exec = async (messageReaction: MessageReaction, user: User): Promise<void> => {
        // if the reaction has partial data, fetch it
        if (messageReaction.partial) {
            messageReaction = await messageReaction.fetch();
        }
        // if the reaction's message has partial data, fetch it too
        if (messageReaction.message.partial) {
            messageReaction.message = await messageReaction.message.fetch();
        }

        // check whether the reaction fired from a guild channel
        if (!messageReaction.message.guild) return;

        // identify the member
        const member = messageReaction.message.guild.member(user);

        // handle reaction roles
        this.handleReactionRoles(messageReaction, member).catch(() => {
            // this error can be ignored
        });


        const guildDocument = await (messageReaction.message.guild as BastionGuild).getDocument();

        // handle reaction pinning, if enabled
        if (guildDocument.reactionPinning) {
            this.handleReactionPinning(messageReaction, member).catch(() => {
                // this error can be ignored
            });
        }
    }
}
