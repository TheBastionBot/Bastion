/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { GuildMember } from "discord.js";

import { Guild as GuildDocument } from "../../models/Guild.js";
import MemberModel from "../../models/Member.js";

const ESTABLISHED_TENURE = 6048e5;

/**
 * Check whether a member is established in the guild, which dampens how
 * harshly their signals are scored.
 * @param member The member being scored.
 * @param guildDocument The guild's settings.
 */
export const established = async (member: GuildMember, guildDocument: GuildDocument): Promise<boolean> => {
    // any role beyond @everyone, boosting, or a week in the guild
    if (member.roles.cache.size > 1) return true;
    if (member.premiumSinceTimestamp) return true;
    if (member.joinedTimestamp && Date.now() - member.joinedTimestamp > ESTABLISHED_TENURE) return true;

    // having earned experience is an additional way to qualify
    if (guildDocument.gamification) {
        const memberDocument = await MemberModel.findOne({ user: member.id, guild: member.guild.id }).select("level").lean();

        if (memberDocument?.level > 0) return true;
    }

    return false;
};
