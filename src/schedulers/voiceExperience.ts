/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import mongoose from "mongoose";
import { GuildMember } from "discord.js";
import { Logger, Scheduler } from "@bastion/tesseract";

import GuildModel, { Guild as GuildDocument } from "../models/Guild.js";
import MemberModel, { Member } from "../models/Member.js";
import * as gamification from "../utils/gamification.js";
import * as members from "../utils/members.js";

const VOICE_XP_PER_TICK = 5;

class VoiceExperienceScheduler extends Scheduler {
    constructor() {
        super("voiceExperience", "0 */5 * * * *");  // every 5 minutes
    }

    public async exec(): Promise<void> {
        try {
            // check whether the client is ready
            if (!this.client.isReady()) return;

            // check whether the guild cache is empty
            if (!this.client.guilds.cache.size) return;

            // collect eligible members per guild from this shard's cached voice states
            const eligibleByGuild = new Map<string, GuildMember[]>();
            for (const guild of this.client.guilds.cache.values()) {
                const eligible: GuildMember[] = [];

                // members might not be cached, so anyone not known to be a bot is counted as human
                const humansByChannel = new Map<string, number>();
                for (const voiceState of guild.voiceStates.cache.values()) {
                    if (!voiceState.channelId || voiceState.member?.user.bot) continue;
                    humansByChannel.set(voiceState.channelId, (humansByChannel.get(voiceState.channelId) ?? 0) + 1);
                }

                for (const voiceState of guild.voiceStates.cache.values()) {
                    const { channel, member } = voiceState;

                    // must be in a voice channel with a resolved, non-bot member
                    if (!channel || !member || member.user.bot) continue;

                    // ignore the AFK channel and muted / deafened members
                    if (channel.id === guild.afkChannelId || voiceState.mute || voiceState.deaf) continue;

                    // make sure user is not alone
                    if ((humansByChannel.get(channel.id) ?? 0) < 2) continue;

                    eligible.push(member);
                }

                if (eligible.length) eligibleByGuild.set(guild.id, eligible);
            }

            // nothing to do if no eligible members anywhere on this shard
            if (!eligibleByGuild.size) return;

            // load gamification-enabled guilds that have eligible members
            const guildDocuments = await GuildModel.find({
                _id: { $in: [ ...eligibleByGuild.keys() ] },
                gamification: true,
            });
            if (!guildDocuments.length) return;

            // read current experience/level for all eligible members
            const userIds = new Set<string>();
            for (const guildDocument of guildDocuments) {
                for (const member of eligibleByGuild.get(guildDocument.id)) userIds.add(member.id);
            }
            const memberDocuments = await MemberModel.find({
                guild: { $in: guildDocuments.map(g => g.id) },
                user: { $in: [ ...userIds ] },
            });
            const byKey = new Map(memberDocuments.map(d => [ `${ d.guild }:${ d.user }`, d ]));

            const operations: mongoose.AnyBulkWriteOperation<Member>[] = [];
            const levelUps: { member: GuildMember; guildDocument: GuildDocument; level: number }[] = [];

            for (const guildDocument of guildDocuments) {
                for (const member of eligibleByGuild.get(guildDocument.id)) {
                    const current = byKey.get(`${ guildDocument.id }:${ member.id }`);
                    const currentExperience = current?.experience || 0;
                    const currentLevel = current?.level || 0;

                    // respect the max experience cap
                    if (currentExperience >= gamification.MAX_EXPERIENCE) continue;

                    // compute the XP award and the resulting level
                    const amount = VOICE_XP_PER_TICK * (member.premiumSinceTimestamp ? 2 : 1);
                    const newLevel = gamification.computeLevel(currentExperience + amount, guildDocument.gamificationMultiplier);
                    const leveledUp = newLevel > currentLevel;

                    // compute new level and credit the currency reward
                    const update: mongoose.mongo.UpdateFilter<Member> = { $inc: { experience: amount } };
                    if (leveledUp) {
                        update.$inc = { experience: amount, balance: newLevel * gamification.DEFAUL_CURRENCY_REWARD_MULTIPLIER };
                        update.$set = { level: newLevel };
                        levelUps.push({ member, guildDocument, level: newLevel });
                    }

                    operations.push({
                        updateOne: {
                            filter: { user: member.id, guild: guildDocument.id },
                            update,
                            upsert: true,
                        },
                    });
                }
            }

            // single batched write for all guilds on this shard
            if (operations.length) {
                await MemberModel.bulkWrite(operations);
            }

            // level-up side effects (roles + notification) for members who crossed a level this tick
            for (const { member, guildDocument, level } of levelUps) {
                members.handleLevelUp(member, guildDocument, level);
            }
        } catch (e) {
            Logger.error(e);
        }
    }
}

export { VoiceExperienceScheduler as Scheduler };
