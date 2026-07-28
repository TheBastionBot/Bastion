/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { GuildMember, Message, PermissionFlagsBits } from "discord.js";
import { Logger } from "@bastion/tesseract";

import { Guild as GuildDocument } from "../../models/Guild.js";
import memcache from "../memcache.js";
import { alertRaid, execute } from "./enforce.js";
import { attachmentFingerprints, hash, hostnames } from "./fingerprint.js";
import { evaluate } from "./signals.js";
import { established } from "./tenure.js";
import { action, DEFAULT_LEVEL, ProtectionAction, score, tier } from "./tiers.js";
import * as window from "./window.js";

const ACTED_TTL = 0.5;
export const IGNORE_TTL = 10;
const RAID_JOIN_FLOOR = 10;
const RAID_JOIN_RATIO = 0.001;
const RAID_JOIN_CEILING = 200;
const RAID_DURATION = 6e5;
const EVERYONE_MENTION_WEIGHT = 10;

const IGNORE_KEY = (guild: string, user: string): string => `protection:ignored:${ guild }:${ user }`;
const ACTED_KEY = (guild: string, user: string): string => `protection:acted:${ guild }:${ user }`;

// in-flight guard for evaluateMessage
const inFlight = new Set<string>();

/**
 * Resolve a thread to the channel it actually belongs to, so a thread's
 * messages are grouped with its parent channel's for distinct-channel counts.
 * @param message The message.
 */
const resolveChannel = (message: Message<true>): string =>
    message.channel.isThread() ? message.channel.parentId ?? message.channelId : message.channelId;

/**
 * Reduce a message to the little that detection needs.
 * @param message The message.
 * @param channel The message's resolved (parent) channel.
 */
const toEntry = (message: Message<true>, channel: string): window.WindowEntry => {
    const permissions = message.channel.permissionsFor(message.member) ?? message.member.permissions;

    return {
        id: message.id,
        channel,
        thread: message.channel.isThread() ? message.channelId : null,
        timestamp: message.createdTimestamp,
        hash: message.content ? hash(message.content) : 0,
        hostnames: hostnames(message.content),
        attachments: attachmentFingerprints(message.attachments.map(attachment => ({ name: attachment.name, size: attachment.size }))),
        // trusted members aren't scored for @everyone; individual mentions still count.
        mentions: message.mentions.users.size + message.mentions.roles.size
            + (message.mentions.everyone && !permissions.has(PermissionFlagsBits.MentionEveryone) ? EVERYONE_MENTION_WEIGHT : 0),
    };
};

/**
 * Evaluate a message for spam and raid activity, and act on it.
 * @param message The message.
 * @param guildDocument The guild's settings
 * @param previousContent The message's content before this edit, `null` when
 * the pre-edit message is only partially cached, or `undefined` when this is
 * a new message rather than an edit.
 */
export const evaluateMessage = async (message: Message<true>, guildDocument: GuildDocument, previousContent?: string | null): Promise<void> => {
    // nothing is enabled
    if (!guildDocument.protection && !guildDocument.honeypotChannel) return;

    const channel = resolveChannel(message);
    const honeypot = channel === guildDocument.honeypotChannel;

    // only the honeypot is set up, and this isn't it
    if (!guildDocument.protection && !honeypot) return;

    if (!message.member) return;

    // anyone trusted to delete messages isn't a spam bot
    const permissions = message.channel.permissionsFor(message.member) ?? message.member.permissions;
    if (permissions.has(PermissionFlagsBits.ManageMessages)) return;

    // a moderator recently marked this member as ignored
    if (memcache.get(IGNORE_KEY(message.guildId, message.author.id))) return;

    const entry = toEntry(message, channel);
    const entries = window.record(message.guildId, message.author.id, entry);

    // only claim a link was newly added when the previous content is known.
    // `previousContent` is `null` for a partial pre-edit message and not firing is
    // deliberate. a wrongly-fired signal here would delete an innocent member's message.
    const newHostnames = typeof previousContent === "string"
        ? entry.hostnames.filter(host => !hostnames(previousContent).includes(host))
        : [];

    const signals = evaluate(entries, {
        honeypot,
        newHostnames,
        accountAge: Date.now() - message.author.createdTimestamp,
        memberAge: message.member.joinedTimestamp ? Date.now() - message.member.joinedTimestamp : 0,
    });

    if (!signals.length) return;

    // the rest of a burst belongs to the incident that was already handled.
    // the stored value is the action that incident resolved to, so an
    // "alert" incident (nothing removed) doesn't silently start deleting the
    // rest of the burst.
    const acted = memcache.get(ACTED_KEY(message.guildId, message.author.id)) as ProtectionAction;
    if (acted) {
        if (acted !== "alert") await message.delete().catch(Logger.error);
        return;
    }

    // everything above this point is in-memory only, so no other event for
    // this member can have reached here yet. from here on there's an await,
    // so without this guard several messages in the same burst would all
    // pass the ACTED_KEY check above before any of them sets it.
    const memberKey = `${ message.guildId }:${ message.author.id }`;
    if (inFlight.has(memberKey)) return;
    inFlight.add(memberKey);

    try {
        const value = score(
            signals,
            await established(message.member, guildDocument),
            window.raiding(message.guildId, Date.now()),
        );

        const confidence = tier(value);
        if (!confidence) return;

        // a guild that only configured a honeypot, without enabling
        // protection, still gets the lenient level's enforcement
        const level = guildDocument.protection || DEFAULT_LEVEL;
        const resolvedAction = action(level, confidence);

        memcache.set(ACTED_KEY(message.guildId, message.author.id), resolvedAction, ACTED_TTL);

        await execute({
            member: message.member,
            entries,
            signals,
            score: value,
            tier: confidence,
            action: resolvedAction,
        }, guildDocument);

        // the handled messages mustn't trigger a second incident
        window.forget(message.guildId, message.author.id);
    } finally {
        inFlight.delete(memberKey);
    }
};

/**
 * The raid threshold for a guild of the given size. a fixed floor for small
 * servers, scaling with member count above that, capped at a ceiling so no
 * server's threshold grows unbounded.
 * @param memberCount The guild's member count.
 */
const raidThreshold = (memberCount: number): number =>
    Math.min(RAID_JOIN_CEILING, Math.max(RAID_JOIN_FLOOR, Math.ceil(memberCount * RAID_JOIN_RATIO)));

/**
 * Record a member joining.
 * @param guild The guild id.
 * @param memberCount The guild's member count, used to scale the threshold.
 * @returns The windowed join count when it is at or above the raid
 * threshold, otherwise 0.
 */
export const recordJoin = (guild: string, memberCount: number): number => {
    const joins = window.recordJoin(guild, Date.now());
    return joins >= raidThreshold(memberCount) ? joins : 0;
};

/**
 * Raise raid mode when too many members have joined at once. Only meaningful
 * once `recordJoin` has reported the threshold crossed, since that's what
 * the join count is.
 * @param member The member who joined.
 * @param guildDocument The guild's settings.
 * @param joins The windowed join count, as reported by `recordJoin`.
 */
export const evaluateJoin = async (member: GuildMember, guildDocument: GuildDocument, joins: number): Promise<void> => {
    if (!guildDocument.protection) return;

    const now = Date.now();

    // already raiding, so moderators have been alerted
    if (window.raiding(member.guild.id, now)) return;

    const until = now + RAID_DURATION;
    window.startRaid(member.guild.id, until);

    await alertRaid(member.guild, joins, until, guildDocument);
};

/**
 * Whether a guild is currently in raid mode. Only ever true for guilds with
 * `protection` enabled, so callers don't need to re-check that themselves.
 * @param guild The guild id.
 */
export const isRaiding = (guild: string): boolean => window.raiding(guild, Date.now());

/**
 * Clear a member's recorded activity, so ignoring them takes effect
 * immediately.
 * @param guild The guild id.
 * @param user The user id.
 */
export const ignoreMember = (guild: string, user: string): void => {
    memcache.delete(ACTED_KEY(guild, user));
    memcache.set(IGNORE_KEY(guild, user), true, IGNORE_TTL);
    window.forget(guild, user);
};
