/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants } from "tesseract";
import { GuildMember, MessageEmbedOptions, MessageReaction, TextChannel, User } from "discord.js";

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

    handleSuggestions = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // check whether the reaction was of a suggestion
        if (![ "✅", "❎" ].includes(messageReaction.emoji.name)) return;
        // check whether the member has permission to accept/reject suggestion
        if (!(messageReaction.message.channel as TextChannel).permissionsFor(member).has("MANAGE_CHANNELS")) return;

        // get the suggestion message & embed
        const suggestionMessage = messageReaction.message;
        const suggestionEmbed = suggestionMessage.embeds[0];

        // check whether it's a valid suggestion message
        if (!suggestionEmbed) return;
        if (!suggestionEmbed.title.startsWith("Suggestion")) return;

        // update the suggestion status
        suggestionEmbed.color = messageReaction.emoji.name === "✅" ? Constants.COLORS.GREEN : messageReaction.emoji.name === "❎" ? Constants.COLORS.RED : Constants.COLORS.INDIGO;
        suggestionEmbed.title = "Suggestion " + (messageReaction.emoji.name === "✅" ? "Accepted" : messageReaction.emoji.name === "❎" ? "Rejected" : "");

        // update suggestion message
        await suggestionMessage.edit({
            embed: suggestionEmbed,
        });
    }

    handleStarboard = async (messageReaction: MessageReaction, member: GuildMember, starboardChannel: TextChannel): Promise<void> => {
        // check whether the reaction was of a star
        if (![ "🌠", "🌟", "⭐" ].includes(messageReaction.emoji.name)) return;
        // check whether the member has at least one role
        if (member.roles.cache.size <= 1) return;
        // check whether the message author is starring their own message
        if (messageReaction.message.author.id === member.user.id) return;

        // extract image attachment from the message
        // although, it can be a video.
        // TODO: find a way to filter out videos.
        const imageAttachments = messageReaction.message.attachments.filter(a => Boolean(a.height && a.width));
        const imageAttachment = imageAttachments.first();

        // check whether the message has any content
        if (!messageReaction.message.content && !imageAttachment) return;

        // post it in the starboard
        await starboardChannel.send({
            embed: {
                color: Constants.COLORS.YELLOW,
                author: {
                    name: messageReaction.message.author.tag,
                    iconURL: messageReaction.message.author.displayAvatarURL({
                        dynamic: true,
                        size: 64,
                    }),
                },
                description: messageReaction.message.content,
                fields: [
                    {
                        name: "Source",
                        value: "[Click here to Jump to the Message.](" + messageReaction.message.url  + ")",
                        inline: true,
                    },
                ],
                image: {
                    url: imageAttachment ? imageAttachment.url : null,
                },
                footer: {
                    text: "Starboard",
                },
            },
        });
    }

    handleReactionAnnouncement = async (messageReaction: MessageReaction, member: GuildMember, announcementChannel: TextChannel): Promise<void> => {
        // check whether the reaction was of an announcement
        if (![ "📣", "📢" ].includes(messageReaction.emoji.name)) return;
        // check whether the member has permission to announce
        if (!member.permissions.has("MANAGE_GUILD")) return;

        // override message embed footer
        const footerMessage = member.user.tag + " announced via Announcement Pinnning.";
        const embed: MessageEmbedOptions = messageReaction.message.embeds && messageReaction.message.embeds.length ? messageReaction.message.embeds[0] : {};
        embed.footer = {
            ...embed.footer,
            text: embed.footer && embed.footer.text ? footerMessage + " • " + embed.footer.text : footerMessage,
        };

        // announce the message
        await announcementChannel.send(messageReaction.message.content, {
            embed,
            files: [ ...messageReaction.message.attachments.values() ],
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
                for (const reaction of messageReaction.message.reactions.cache.filter(r => r.users.cache.has(member.user.id) && r.emoji.name !== messageReaction.emoji.name).values()) {
                    await reaction.users.remove(member).catch(() => {
                        // this error can be ignored
                    });
                }
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

        // handle suggestions, if enabled and the suggestions channel exists
        if (guildDocument.suggestionsChannelId && messageReaction.message.channel.id === guildDocument.suggestionsChannelId) {
            this.handleSuggestions(messageReaction, member).catch(() => {
                // this error can be ignored
            });
        }

        // handle starboard, if enabled and the starboard channel exists
        if (guildDocument.starboardChannelId && messageReaction.message.guild.channels.cache.has(guildDocument.starboardChannelId)) {
            this.handleStarboard(messageReaction, member, messageReaction.message.guild.channels.cache.get(guildDocument.starboardChannelId) as TextChannel).catch(() => {
                // this error can be ignored
            });
        }

        // handle reaction announcement, if enabled and the announcement channel exists
        if (guildDocument.reactionAnnouncements && messageReaction.message.guild.channels.cache.has(guildDocument.announcementsChannelId)) {
            this.handleReactionAnnouncement(messageReaction, member, messageReaction.message.guild.channels.cache.get(guildDocument.announcementsChannelId) as TextChannel).catch(() => {
                // this error can be ignored
            });
        }

        // handle reaction pinning, if enabled
        if (guildDocument.reactionPinning) {
            this.handleReactionPinning(messageReaction, member).catch(() => {
                // this error can be ignored
            });
        }
    }
}
