/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { GuildMember, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";

export interface HoneypotCheck {
    name: string;
    ok: boolean;
    fix: string;
    /** Whether this check determines the trap's basic visibility. */
    critical: boolean;
}

/**
 * Check whether the honeypot channel is actually able to catch anything.
 * @param channel The honeypot channel.
 * @param me The bot's own member in the guild.
 */
export const checkHoneypot = (channel: GuildTextBasedChannel, me: GuildMember): HoneypotCheck[] => {
    const everyone = channel.permissionsFor(channel.guild.roles.everyone);

    return [
        {
            name: "Everyone can see the channel",
            ok: everyone.has(PermissionFlagsBits.ViewChannel),
            fix: "Allow **View Channel** for `@everyone` — spam bots skip channels they can't see.",
            critical: true,
        },
        {
            name: "Everyone can post in the channel",
            ok: everyone.has(PermissionFlagsBits.SendMessages),
            fix: "Allow **Send Messages** for `@everyone` — nothing can be caught in a channel nobody can post in.",
            critical: true,
        },
        {
            name: "Slowmode is off",
            ok: !channel.rateLimitPerUser,
            fix: "Turn slowmode off — it makes flooding fail here while succeeding elsewhere.",
            critical: false,
        },
        {
            name: "I can delete messages",
            ok: channel.permissionsFor(me).has(PermissionFlagsBits.ManageMessages),
            fix: "I need permission to **Manage Messages** in this channel.",
            critical: false,
        },
        {
            name: "I can ban members",
            ok: me.permissions.has(PermissionFlagsBits.BanMembers),
            fix: "I need the **Ban Members** permission.",
            critical: false,
        },
    ];
};
