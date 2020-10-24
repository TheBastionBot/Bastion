/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import { Constants, Listener } from "@bastion/tesseract";
import { VoiceState } from "discord.js";

import GuildModel from "../models/Guild";
import * as constants from "../utils/constants";
import * as omnic from "../utils/omnic";

export = class VoiceStateUpdateListener extends Listener {
    private newSessionChannelPrefix: string;

    constructor() {
        super("voiceStateUpdate", {
            mode: Constants.LISTENER_MODE.ON,
        });

        this.newSessionChannelPrefix = "➕ New";
    }

    exec = async (oldState: VoiceState, newState: VoiceState): Promise<void> => {
        if (newState.channelID === oldState.channelID) return;
        if (!(oldState.channel && oldState.channel.parent) && !(newState.channel && newState.channel.parent)) return;

        // get guild document
        const guild = await GuildModel.findById(oldState.guild ? oldState.guild.id : newState.guild.id);
        if (!guild.voiceSessions || !guild.voiceSessions.categories) return;


        // check for premium membership
        if (constants.isPublicBastion(this.client.user)) {
            // fetch the premium tier
            const tier = await omnic.fetchPremiumTier(oldState.guild || newState.guild).catch(() => {
                // this error can be ignored
            });
            if (!tier) return;
        }


        // check whether all members left the old channel
        if (oldState.channel && oldState.channel.parent && guild.voiceSessions.categories.includes(oldState.channel.parentID) && !oldState.channel.name.startsWith(this.newSessionChannelPrefix) && oldState.channel.members.size === 0 && oldState.channel.deletable) {
            oldState.channel.delete("Members Left");
        }


        // member joined the channel
        if (newState.channel && newState.channel.parent && guild.voiceSessions.categories.includes(newState.channel.parentID)) {
            // check whether member is requesting a new session channel to be created
            if (newState.channel.name.startsWith(this.newSessionChannelPrefix)) {
                const sessionChannelName = newState.member.displayName + (newState.member.displayName.toLowerCase().endsWith("s") ? "'" : "'s") + " Channel";

                // HACK: channel number might have concurrency problem
                const newSessionChannel = await newState.channel.guild.channels.create(sessionChannelName + " #" + (newState.channel.parent.children.filter(c => c.type === "voice" && c.name.startsWith(sessionChannelName + " #")).size + 1), {
                    type: "voice",
                    bitrate: newState.channel.guild.premiumTier ? newState.channel.guild.premiumTier * 128e3 : 96e3,
                    parent: newState.channel.parent,
                    // TODO: Add member limit
                    // userLimit: ,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [ "CONNECT", "CREATE_INSTANT_INVITE", "MOVE_MEMBERS", "MUTE_MEMBERS" ],
                        },
                        {
                            id: newState.member.guild.id,
                            allow: [ "SPEAK", "VIEW_CHANNEL" ],
                            deny: [ "CONNECT", "CREATE_INSTANT_INVITE" ],
                        },
                    ],
                    reason: "Requested by " + (newState.member.user ? newState.member.user.tag : newState.member.id),
                });

                // move member to the new channel
                await newState.member.voice.setChannel(newSessionChannel).catch(console.error);
            }
        }
    }
}
