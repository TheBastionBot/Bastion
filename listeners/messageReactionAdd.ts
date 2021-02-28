/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Listener, Constants, Logger } from "@bastion/tesseract";
import { GuildMember, MessageEmbedOptions, MessageReaction, TextChannel, User, VoiceChannel } from "discord.js";

import { Guild as GuildDocument } from "../models/Guild";
import ReactionRoleGroup from "../models/ReactionRoleGroup";
import RoleModel from "../models/Role";
import BastionGuild = require("../structures/Guild");
import * as emojis from "../utils/emojis";
import memcache from "../utils/memcache";

export = class MessageReactionAddListener extends Listener {
    constructor() {
        super("messageReactionAdd", {
            mode: Constants.LISTENER_MODE.ON,
        });
    }

    handleSuggestions = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // don't allow bots to handle suggestions
        if (member.user.bot) return;

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

        // check whether the message is in starboard cache
        const starboardCache = memcache.get("starboard") as string[];
        if (starboardCache && starboardCache instanceof Array && starboardCache.includes(messageReaction.message.id)) return;

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

        if (starboardCache && starboardCache instanceof Array) {
            starboardCache.push(messageReaction.message.id);
        }
        memcache.set("starboard", starboardCache ? starboardCache : [ messageReaction.message.id ]);
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
        await messageReaction.message.pin({ reason: "Pin reaction added by " + member.user ? member.user.tag : member.id });
    }

    handleReactionRoles = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // don't give reaction roles to bots
        if (member.user.bot) return;

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
                await member.roles.remove(reactionRolesGroup.roles, "Auto Removed via Reaction Roles").catch(() => {
                    // this error can be ignored
                });
            }

            // add the reaction role
            await member.roles.add(reactionRole._id, "Added via Reaction Roles");
        }
    }

    handleVoiceSessions = async (messageReaction: MessageReaction, member: GuildMember, guildDocument: GuildDocument): Promise<void> => {
        // don't allow bots to handle voice sessions
        if (member.user.bot) return;

        // check whether voice sessions are available
        if (!guildDocument.voiceSessions || !guildDocument.voiceSessions.categories) return;

        // check whether the reaction was valid
        if (![ "🔒", "🔓", "🔐", "👁️" ].includes(messageReaction.emoji.name)) return;

        // check whether the reaction was made in a valid message
        if (messageReaction.message.author.id !== member.client.user.id) return;
        if (!messageReaction.message.embeds.length || !messageReaction.message.embeds[0].title || !messageReaction.message.embeds[0].title.startsWith("Voice Session Control") || !(messageReaction.message.channel as TextChannel).parentID) return;
        if (!guildDocument.voiceSessions.categories.includes((messageReaction.message.channel as TextChannel).parentID)) return;

        if (member.voice && member.voice.channel && member.voice.channel.parentID && guildDocument.voiceSessions.categories.includes((messageReaction.message.channel as TextChannel).parentID) && member.voice.channel.name.startsWith(member.displayName + "'")) {
            if (messageReaction.emoji.name === "🔒") {
                await (member.voice.channel as VoiceChannel).updateOverwrite(messageReaction.message.guild.id, {
                    CONNECT: false,
                },  "Locking Voice Session");
                await messageReaction.users.remove(member).catch(() => {
                    // this error can be ignored
                });
            } else if (messageReaction.emoji.name === "🔓") {
                await (member.voice.channel as VoiceChannel).updateOverwrite(messageReaction.message.guild.id, {
                    CONNECT: true,
                }, "Unlocking Voice Session");
                await messageReaction.users.remove(member).catch(() => {
                    // this error can be ignored
                });
            } else if (messageReaction.emoji.name === "🔐") {
                await (member.voice.channel as VoiceChannel).updateOverwrite(messageReaction.message.guild.id, {
                    VIEW_CHANNEL: false,
                },  "Hiding Voice Session");
                await messageReaction.users.remove(member).catch(() => {
                    // this error can be ignored
                });
            } else if (messageReaction.emoji.name === "👁️") {
                await (member.voice.channel as VoiceChannel).updateOverwrite(messageReaction.message.guild.id, {
                    VIEW_CHANNEL: true,
                },  "Unhiding Voice Session");
                await messageReaction.users.remove(member).catch(() => {
                    // this error can be ignored
                });
            }
        }
    }

    handleGameLobby = async (messageReaction: MessageReaction, member: GuildMember): Promise<void> => {
        // don't allow bots to handle game lobbies
        if (member.user.bot) return;

        // check whether the reaction was valid
        if (![ "🔈", "👻", "🖐🏻", "🔇", "🔓", "❌" ].includes(messageReaction.emoji.name)) return;

        // check whether the reaction was made in a valid message
        if (!messageReaction.message.embeds.length || !messageReaction.message.embeds[0].title || !messageReaction.message.embeds[0].title.startsWith("Among Us Lobby ") || !(messageReaction.message.channel as TextChannel).parentID) return;

        // find the appropriate channels
        const discussionChannel = (messageReaction.message.channel as TextChannel).parent.children.find(c => c.name === "Discussion") as VoiceChannel;
        const mutedChannel = (messageReaction.message.channel as TextChannel).parent.children.find(c => c.name === "Muted") as VoiceChannel;

        if (messageReaction.emoji.name === "🖐🏻" && (messageReaction.message.channel as TextChannel).topic.trim() === member.id) {
            for (const member of mutedChannel.members.values()) {
                await member.voice.setChannel(discussionChannel);
            }
            await messageReaction.users.remove(member).catch(() => {
                // this error can be ignored
            });
        } else if (messageReaction.emoji.name === "🔇" && (messageReaction.message.channel as TextChannel).topic.trim() === member.id) {
            for (const member of discussionChannel.members.values()) {
                await member.voice.setChannel(mutedChannel);
            }
            await messageReaction.users.remove(member).catch(() => {
                // this error can be ignored
            });
        } else if (messageReaction.emoji.name === "🔓" && (messageReaction.message.channel as TextChannel).topic.trim() === member.id) {
            await (messageReaction.message.channel as TextChannel).updateOverwrite(messageReaction.message.guild.id, {
                ADD_REACTIONS: true,
            });
        } else if (messageReaction.emoji.name === "❌" && (messageReaction.message.channel as TextChannel).topic.trim() === member.id) {
            await mutedChannel.delete();
            await discussionChannel.delete();
            const lobby = (messageReaction.message.channel as TextChannel).parent;
            await messageReaction.message.channel.delete();
            await lobby.delete();
        } else if (messageReaction.emoji.name === "🔈") {
            await discussionChannel.updateOverwrite(member, {
                CONNECT: true,
            });
        } else if (messageReaction.emoji.name === "👻") {
            await discussionChannel.updateOverwrite(member, {
                SPEAK: false,
            });
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
        this.handleReactionRoles(messageReaction, member).catch(Logger.error);

        // handle Among Us game lobby
        this.handleGameLobby(messageReaction, member).catch(Logger.error);


        const guildDocument: GuildDocument = await (messageReaction.message.guild as BastionGuild).getDocument();

        // handle Voice Sessions
        this.handleVoiceSessions(messageReaction, member, guildDocument).catch(Logger.error);

        // handle suggestions, if enabled and the suggestions channel exists
        if (guildDocument.suggestionsChannelId && messageReaction.message.channel.id === guildDocument.suggestionsChannelId) {
            this.handleSuggestions(messageReaction, member).catch(Logger.error);
        }

        // handle starboard, if enabled and the starboard channel exists
        if (guildDocument.starboardChannelId && messageReaction.message.guild.channels.cache.has(guildDocument.starboardChannelId)) {
            this.handleStarboard(messageReaction, member, messageReaction.message.guild.channels.cache.get(guildDocument.starboardChannelId) as TextChannel).catch(Logger.error);
        }

        // handle reaction announcement, if enabled and the announcement channel exists
        if (guildDocument.reactionAnnouncements && messageReaction.message.guild.channels.cache.has(guildDocument.announcementsChannelId)) {
            this.handleReactionAnnouncement(messageReaction, member, messageReaction.message.guild.channels.cache.get(guildDocument.announcementsChannelId) as TextChannel).catch(Logger.error);
        }

        // handle reaction pinning, if enabled
        if (guildDocument.reactionPinning) {
            this.handleReactionPinning(messageReaction, member).catch(Logger.error);
        }
    }
}
