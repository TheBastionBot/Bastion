/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Command, CommandArguments, Constants } from "@bastion/tesseract";
import { Message } from "discord.js";

import RoleModel from "../../models/Role";
import ReactionRoleGroupModel from "../../models/ReactionRoleGroup";
import * as constants from "../../utils/constants";
import * as emojis from "../../utils/emojis";
import * as errors from "../../utils/errors";
import * as omnic from "../../utils/omnic";
import BastionGuild = require("../../structures/Guild");
import BastionRole = require("../../structures/Role");

export = class ReactionRolesCommand extends Command {
    constructor() {
        super("reactionRoles", {
            description: "It allows you to create (and delete) Reaction Role Groups. A Reaction Role Group is a group of reactions emojis that can be used by a member on the Reaction Role Message to add (or remove) roles to themselves. Reaction Roles in a single group can also be set as mutually exclusive. It also allows you to assign emojis to roles, that can be used in reacting to the Reaction Role Message.",
            triggers: [],
            arguments: {
                array: [ "role" ],
                boolean: [ "delete", "exclusive" ],
                string: [ "message", "role", "emoji" ],
            },
            scope: "guild",
            owner: false,
            cooldown: 0,
            ratelimit: 1,
            clientPermissions: [ "MANAGE_ROLES" ],
            userPermissions: [ "MANAGE_ROLES" ],
            syntax: [
                "reactionRoles",
                "reactionRoles --role ROLE --emoji EMOJI",
                "reactionRoles --role ROLE --no-emoji",
                "reactionRoles --message ID --role ROLES...",
                "reactionRoles --message ID --role ROLES... --exclusive",
                "reactionRoles --message ID --delete",
            ],
        });
    }

    exec = async (message: Message, argv: CommandArguments): Promise<unknown> => {
        if (argv.message && argv.delete) {
            // remove reaction roles group
            await ReactionRoleGroupModel.deleteOne({
                _id: argv.message,
            });

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: Constants.COLORS.RED,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "reactionRolesGroupRemove", message.author.tag, argv.message),
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        if (argv.message && argv.role && argv.role.length) {
            // check for premium membership
            if (constants.isPublicBastion(this.client.user)) {
                // fetch the premium tier
                const tier = await omnic.fetchPremiumTier(message.guild).catch(() => {
                    // this error can be ignored
                });


                if (tier) { // check for premium membership limits
                    if (tier === omnic.PremiumTier.GOLD && argv.role.length > constants.LIMITS.GOLD.REACTION_ROLES_PER_GROUP) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitReactionRoleGroupRoles", constants.LIMITS.GOLD.REACTION_ROLES_PER_GROUP));
                    } else if (tier === omnic.PremiumTier.PLATINUM && argv.role.length > constants.LIMITS.PLATINUM.REACTION_ROLES_PER_GROUP) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitReactionRoleGroupRoles", constants.LIMITS.PLATINUM.REACTION_ROLES_PER_GROUP));
                    }
                } else if (argv.role.length > constants.LIMITS.REACTION_ROLES_PER_GROUP) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumReactionRoleGroupRoles", constants.LIMITS.REACTION_ROLES_PER_GROUP));
                }


                // find reaction role groups in the server
                const reactionRoleGroupsCount = await ReactionRoleGroupModel.countDocuments({
                    guild: message.guild.id,
                });


                if (tier) { // check for premium membership limits
                    if (tier === omnic.PremiumTier.GOLD && reactionRoleGroupsCount >= constants.LIMITS.GOLD.REACTION_ROLE_GROUPS) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitReactionRoleGroups", constants.LIMITS.GOLD.REACTION_ROLE_GROUPS));
                    } else if (tier === omnic.PremiumTier.PLATINUM && reactionRoleGroupsCount >= constants.LIMITS.PLATINUM.REACTION_ROLE_GROUPS) {
                        throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.LIMITED_PREMIUM_MEMBERSHIP, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "membershipLimitReactionRoleGroups", constants.LIMITS.PLATINUM.REACTION_ROLE_GROUPS));
                    }
                } else if (reactionRoleGroupsCount >= constants.LIMITS.REACTION_ROLE_GROUPS) {
                    throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.PREMIUM_MEMBERSHIP_REQUIRED, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "premiumReactionRoleGroups", constants.LIMITS.REACTION_ROLE_GROUPS));
                }
            }


            // identify the reaction roles message
            const reactionMessage = await message.channel.messages.fetch(argv.message, false).catch(() => {
                // this error can be ignored
            });

            if (!reactionMessage) throw new Error("MESSAGE_NOT_FOUND");

            // identify the roles
            const roles = this.client.resolver.resolveRoles(message.guild, argv.role);

            if (!roles.length) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            // add reaction roles group
            await ReactionRoleGroupModel.findByIdAndUpdate(reactionMessage.id, {
                _id: reactionMessage.id,
                channel: message.channel.id,
                guild: message.guild.id,
                roles: roles.map(r => r.id),
                exclusive: argv.exclusive ? argv.exclusive : undefined,
            }, {
                upsert: true,
            });

            // acknowledge
            await message.channel.send({
                embed: {
                    color: Constants.COLORS.GREEN,
                    description: this.client.locale.getString((message.guild as BastionGuild).document.language, "info", "reactionRolesGroupAdd", message.author.tag, reactionMessage.url),
                },
            }).catch(() => {
                // this error can be ignored
            });

            // fetch roles in this group that have emojis
            const rolesWithEmojis = await RoleModel.find({
                $or: roles.map(r => ({ _id: r.id })),
                guild: message.guild.id,
                emoji: { $exists: true },
            });

            // add reactions to reaction roles message
            if (rolesWithEmojis && rolesWithEmojis.length) {
                for (const role of rolesWithEmojis) {
                    const emoji = emojis.parseEmoji(role.emoji);
                    await reactionMessage.react(emoji.reaction);
                }
            }

            return;
        }

        if (argv.role) {
            const identifier: string = argv.role ? argv.role.join(" ") : "";

            // identify the role
            const role = this.client.resolver.resolveRole(message.guild, identifier) as BastionRole;

            if (!role) throw new errors.DiscordError(errors.BASTION_ERROR_TYPE.ROLE_NOT_FOUND, this.client.locale.getString((message.guild as BastionGuild).document.language, "errors", "roleNotFound"));

            // get the role document if it exists
            let roleDocument = await role.fetchDocument();

            // otherwise, create the document if required
            if (!roleDocument && argv.emoji) {
                roleDocument = await role.createDocument();
            }

            // update role emoji
            if (argv.emoji) {
                const emoji = emojis.parseEmoji(argv.emoji);

                // set role emoji
                roleDocument.emoji = emoji.value;

                // save document
                await roleDocument.save();
            } else if (roleDocument && argv.emoji === false) {
                // remove role emoji
                roleDocument.emoji = undefined;

                // save document
                await roleDocument.save();
            }

            const roleEmoji = roleDocument ? emojis.parseEmoji(roleDocument.emoji) : undefined;

            // acknowledge
            return await message.channel.send({
                embed: {
                    color: argv.emoji ? Constants.COLORS.GREEN : argv.emoji === false ? Constants.COLORS.RED : Constants.COLORS.IRIS,
                    title: argv.emoji ? "Role Emoji Added" : argv.emoji === false ? "Role Emoji Removed" : "Role Emoji",
                    fields: [
                        {
                            name: "Role",
                            value: role.name || "-",
                            inline: true,
                        },
                        {
                            name: "Emoji",
                            value: roleEmoji ? roleEmoji.reaction === roleEmoji.value ? message.guild.emojis.cache.get(roleEmoji.reaction) || roleEmoji.value : roleEmoji.reaction : "-",
                            inline: true,
                        },
                    ],
                },
            }).catch(() => {
                // this error can be ignored
            });
        }

        // list all reaction role groups
        const reactionRoleGroups = await ReactionRoleGroupModel.find({
            // guild: message.guild.id,
        });

        if (!reactionRoleGroups) throw new Error("NO_REACTION_ROLES");


        // acknowledge
        await message.channel.send({
            embed: {
                title: "Reaction Role Groups",
                fields: reactionRoleGroups.map(group => ({
                    name: group._id,
                    value:  group.roles.length + " Roles" + (group.exclusive ? " / Exclusive" : "") + " / [Jump to Reaction Message](https://discord.com/channels/" + group.guild + "/" + group.channel + "/" + group._id  + ")",
                })),
            },
        }).catch(() => {
            // this error can be ignored
        });
    }
}
