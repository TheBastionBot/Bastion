/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { MessageReaction, User } from "discord.js";

import ReactionRoleGroup from "../models/ReactionRoleGroup";
import RoleModel from "../models/Role";
import * as emojis from "../utils/emojis";

export = class MessageReactionAddListener extends Listener {
    constructor() {
        super("messageReactionAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    exec = async (messageReaction: MessageReaction, user: User): Promise<void> => {
        if (!messageReaction.message.guild) return;

        // identify the member
        const member = messageReaction.message.guild.member(user);

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
}
