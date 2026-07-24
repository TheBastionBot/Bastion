/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
import { Client, Listener, Logger } from "@bastion/tesseract";
import { ButtonStyle, ChannelType, ComponentType, PermissionFlagsBits, VoiceState } from "discord.js";

import GuildModel from "../models/Guild.js";
import MessageComponents from "../utils/components.js";
import { isPublicBastion } from "../utils/constants.js";
import * as members from "../utils/members.js";
import { isPremiumUser } from "../utils/premium.js";

class VoiceStateUpdateListener extends Listener<"voiceStateUpdate"> {
    private newSessionChannelPrefix: string;

    constructor() {
        super("voiceStateUpdate");

        this.newSessionChannelPrefix = "➕ ";
    }

    public async exec(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (oldState.channelId === newState.channelId) return;
        if (!oldState.channel?.parentId && !newState.channel?.parentId) return;

        const guild = await GuildModel.findById(oldState.guild?.id || newState.guild?.id);

        if (guild.voiceSessionCategories?.length) {
            // check for premium membership
            if (isPublicBastion(oldState.client.user.id)) {
                if (!await isPremiumUser(oldState.guild?.ownerId)) return;
            }

            // check whether all members left the old channel
            if (guild.voiceSessionCategories.includes(oldState.channel?.parentId) && !oldState.channel.name.startsWith(this.newSessionChannelPrefix) && !oldState.guild.voiceStates.cache.some(state => state.channelId === oldState.channelId) && oldState.channel.deletable) {
                await oldState.channel.delete("Voice session automatically ended.");
            }

            // check whether member is requesting a new session channel to be created
            if (guild.voiceSessionCategories.includes(newState.channel?.parentId) && newState.channel.name.startsWith(this.newSessionChannelPrefix)) {
                // resolve the member
                const member = newState.member ?? await members.resolveMember(newState.guild, newState.id);
                if (!member) return;

                // HACK: channel number might have concurrency problem
                const newSessionChannel = await newState.channel.guild.channels.create({
                    name: member.displayName + (member.displayName.toLowerCase().endsWith("s") ? "' " : "'s ") + newState.channel.name.replace(this.newSessionChannelPrefix, ""),
                    type: ChannelType.GuildVoice,
                    bitrate: newState.channel.guild.premiumTier ? newState.channel.guild.premiumTier * 128e3 : 96e3,
                    parent: newState.channel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [
                                PermissionFlagsBits.Connect,
                                PermissionFlagsBits.CreateInstantInvite,
                                PermissionFlagsBits.MoveMembers,
                                PermissionFlagsBits.MuteMembers,
                                PermissionFlagsBits.ViewChannel,
                            ],
                        },
                        {
                            id: member.guild.id,
                            allow: [
                                PermissionFlagsBits.Speak,
                            ],
                            deny: [
                                PermissionFlagsBits.Connect,
                                PermissionFlagsBits.CreateInstantInvite,
                                PermissionFlagsBits.ViewChannel,
                            ],
                        },
                    ],
                    reason: "Voice session for " + (member.user?.tag || member.id),
                });

                // move member to the new channel
                await member.voice.setChannel(newSessionChannel).catch(Logger.ignore);

                // send voice session control message
                await newSessionChannel.send({
                    content: (newState.client as Client).locales.getText(newState.guild.preferredLocale, "voiceSessionControl"),
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: "Lock",
                                    style: ButtonStyle.Secondary,
                                    customId: MessageComponents.VoiceSessionLockButton,
                                },
                                {
                                    type: ComponentType.Button,
                                    label: "Unlock",
                                    style: ButtonStyle.Secondary,
                                    customId: MessageComponents.VoiceSessionUnlockButton,
                                },
                                {
                                    type: ComponentType.Button,
                                    label: "End",
                                    style: ButtonStyle.Danger,
                                    customId: MessageComponents.VoiceSessionEndButton,
                                },
                            ],
                        },
                    ],
                }).catch(Logger.ignore);
            }
        }
    }
}

export { VoiceStateUpdateListener as Listener };
