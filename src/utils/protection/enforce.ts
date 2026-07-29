/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { ButtonStyle, ComponentType, Guild, GuildMember, GuildVerificationLevel, PermissionFlagsBits } from "discord.js";
import { Logger } from "@bastion/tesseract";

import { Guild as GuildDocument } from "../../models/Guild.js";
import MessageComponents from "../components.js";
import { COLORS } from "../constants.js";
import { Signal } from "./signals.js";
import { ProtectionAction } from "./tiers.js";
import { WindowEntry } from "./window.js";

const TIMEOUT_DURATION = 6e5;

/** "1 message" / "3 messages". */
const pluralizeMessages = (count: number): string => `${ count } message${ count === 1 ? "" : "s" }`;

/** Human wording for each action. */
const ACTION_LABELS: Record<ProtectionAction, string> = {
    none: "",
    alert: "report the message",
    delete: "delete the message",
    purgeTimeout: "time out the member",
    purgeBan: "ban the member",
};

export interface Incident {
    member: GuildMember;
    entries: WindowEntry[];
    signals: Signal[];
    score: number;
    tier: number;
    action: ProtectionAction;
}

/** One channel that couldn't be purged, and why. */
interface PurgeFailure {
    /** The channel mention, or null when it couldn't even be resolved to attempt the purge. */
    channel: string | null;
    /** Either bulkDelete's error message, or why the channel couldn't be resolved. */
    reason: string;
}

/** What a purge managed to do. */
interface PurgeResult {
    deleted: number;
    /**
     * One entry per channel that couldn't be purged, so both call sites that
     * report failures can word them identically.
     */
    failures: PurgeFailure[];
}

/**
 * Format a purge failure message.
 * @param failure The failure to describe.
 * @param plural Whether the purge covered several messages.
 */
const formatDeleteFailure = (failure: PurgeFailure, plural: boolean): string => {
    const subject = plural ? "messages" : "the message";

    return failure.channel
        ? `Failed to delete ${ subject } — ${ failure.reason } in ${ failure.channel }`
        : `Failed to delete ${ subject } — ${ failure.reason }`;
};

/**
 * Delete the specified messages, grouped by the channel they actually live
 * in, so messages in threads are deleted from the thread. A failure on one
 * channel doesn't stop the others from being attempted, but every failure is
 * both logged and returned.
 * @param guild The guild.
 * @param entries The messages to delete.
 */
const purge = async (guild: Guild, entries: WindowEntry[]): Promise<PurgeResult> => {
    const byChannel = new Map<string, Set<string>>();

    for (const entry of entries) {
        const channelId = entry.thread ?? entry.channel;
        const ids = byChannel.get(channelId) ?? new Set<string>();
        ids.add(entry.id);
        byChannel.set(channelId, ids);
    }

    let deleted = 0;
    const failures: PurgeFailure[] = [];

    for (const [ channelId, ids ] of byChannel) {
        const channel = guild.channels.cache.get(channelId);

        if (!channel?.isTextBased()) {
            failures.push({ channel: null, reason: "the channel no longer exists" });
            continue;
        }

        try {
            await channel.bulkDelete([ ...ids ], true);
            deleted += ids.size;
        } catch (error) {
            failures.push({ channel: `${ channel }`, reason: (error as Error).message });
        }
    }

    return { deleted, failures };
};

/**
 * Check whether the action can actually be carried out, returning the reason
 * it can't. Preflighting means a blocked action is reported instead of
 * silently failing.
 * @param member The member being acted on.
 * @param action The action to be taken.
 */
const blockedBy = (member: GuildMember, action: ProtectionAction): string => {
    const me = member.guild.members.me;

    if (action !== "alert" && !me?.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return "I don't have the **Manage Messages** permission";
    }
    if (action === "purgeTimeout" && !member.moderatable) {
        return "I can't time out this member — their highest role is above mine, or I don't have the **Moderate Members** permission";
    }
    if (action === "purgeBan" && !member.bannable) {
        return "I can't ban this member — their highest role is above mine, or I don't have the **Ban Members** permission";
    }

    return null;
};

/**
 * Post the incident to the moderation log channel, with review buttons.
 * @param incident The incident.
 * @param guildDocument The guild's settings.
 * @param parts What was actually done, as one or more complete statements.
 * @param banned Whether the member was actually banned, regardless of what the incident intended.
 */
const report = async (incident: Incident, guildDocument: GuildDocument, parts: string[], banned: boolean): Promise<void> => {
    const channel = incident.member.guild.channels.cache.get(guildDocument.moderationLogChannel);

    if (!channel?.isTextBased()) return;

    const components = banned ? [
        {
            type: ComponentType.ActionRow as const,
            components: [
                {
                    type: ComponentType.Button as const,
                    label: "Unban",
                    style: ButtonStyle.Danger as const,
                    customId: MessageComponents.ProtectionUnbanButton,
                },
            ],
        },
    ] : [
        {
            type: ComponentType.ActionRow as const,
            components: [
                {
                    type: ComponentType.Button as const,
                    label: "Ban",
                    style: ButtonStyle.Danger as const,
                    customId: MessageComponents.ProtectionBanButton,
                },
                {
                    type: ComponentType.Button as const,
                    label: "Ignore",
                    style: ButtonStyle.Secondary as const,
                    customId: MessageComponents.ProtectionIgnoreButton,
                },
            ],
        },
    ];

    await channel.send({
        embeds: [
            {
                color: COLORS.ORANGE,
                title: "Suspicious Activity",
                description: incident.signals.length > 1
                    ? incident.signals.map(signal => `• ${ signal.evidence }`).join("\n")
                    : incident.signals[0]?.evidence ?? "",
                fields: [
                    {
                        name: "Member",
                        value: `${ incident.member.user }\n${ incident.member.user.tag }`,
                        inline: true,
                    },
                    {
                        name: "User ID",
                        value: incident.member.id,
                        inline: true,
                    },
                    {
                        name: "Confidence",
                        value: `**${ incident.score.toFixed(1) }** — Tier ${ incident.tier }`,
                        inline: true,
                    },
                    {
                        name: parts.length > 1 ? "Actions" : "Action",
                        value: parts.length > 1
                            ? parts.map(part => `• ${ part }`).join("\n")
                            : parts[0] ?? "",
                    },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
        components,
    }).catch(Logger.error);
};

/** What a punishment attempt resulted in, alongside the purge it followed. */
interface PunishResult {
    /** Every part of the outcome. */
    parts: string[];
    /** Whether the punishment itself actually succeeded. */
    succeeded: boolean;
}

/**
 * Carry out a punishment that follows a purge.
 * @param punishment The punishment to carry out.
 * @param deleted How many messages the purge deleted.
 * @param failures The purge's per-channel failures, if any.
 * @param successPart The statement describing the punishment on success, e.g. "Member banned".
 * @param failureVerb The infinitive naming the punishment, for the failure wording.
 */
const punish = async (
    punishment: () => Promise<unknown>,
    deleted: number,
    failures: PurgeFailure[],
    successPart: string,
    failureVerb: string,
): Promise<PunishResult> => {
    const parts = [ `${ pluralizeMessages(deleted) } deleted` ];

    try {
        await punishment();

        parts.push(successPart);
        for (const failure of failures) parts.push(formatDeleteFailure(failure, true));

        return { parts, succeeded: true };
    } catch (error) {
        parts.push(`Failed to ${ failureVerb } — ${ (error as Error).message }`);
        for (const failure of failures) parts.push(formatDeleteFailure(failure, true));

        return { parts, succeeded: false };
    }
};

/**
 * Carry out the incident's action and report it.
 * @param incident The incident.
 * @param guildDocument The guild's settings.
 */
export const execute = async (incident: Incident, guildDocument: GuildDocument): Promise<void> => {
    const { action, entries, member } = incident;
    const reason = `Protection tier ${ incident.tier }: ${ incident.signals.map(signal => signal.type).join(", ") }`;

    const blocked = blockedBy(member, action);
    let parts = [ "Flagged for review" ];
    let banned = false;

    if (blocked) {
        parts = [ `No action taken — ${ blocked }` ];
    } else {
        try {
            if (action === "delete") {
                const { deleted, failures } = await purge(member.guild, entries.slice(-1));
                parts = deleted
                    ? [ "Message deleted" ]
                    : [ formatDeleteFailure(failures[0] ?? { channel: null, reason: "unknown reason" }, false) ];
            } else if (action === "purgeTimeout") {
                const { deleted, failures } = await purge(member.guild, entries);

                const timeoutEnd = Date.now() + TIMEOUT_DURATION;

                // the punishment is attempted separately from the purge, so
                // a failure here doesn't discard the deletion count.
                ({ parts } = await punish(
                    () => member.timeout(TIMEOUT_DURATION, reason),
                    deleted,
                    failures,
                    `Member timed out until <t:${ Math.floor(timeoutEnd / 1000) }:t>`,
                    "time out the member",
                ));
            } else if (action === "purgeBan") {
                const { deleted, failures } = await purge(member.guild, entries);

                const result = await punish(
                    () => member.ban({ reason }),
                    deleted,
                    failures,
                    "Member banned",
                    "ban the member",
                );
                parts = result.parts;
                banned = result.succeeded;
            }
        } catch (error) {
            // enforcement failures are surfaced, never swallowed
            parts = [ `Failed to ${ ACTION_LABELS[action] } — ${ (error as Error).message }` ];
        }
    }

    // TODO: when the member was actually timed out or banned, send them a
    // direct message explaining the removal and how to secure a compromised
    // account

    await report(incident, guildDocument, parts, banned);
};

/**
 * Alert moderators to a join raid, offering the two responses that are a
 * single reversible API call each.
 * @param guild The guild being raided.
 * @param joins How many members joined inside the window.
 * @param until When raid mode expires.
 * @param guildDocument The guild's settings.
 */
export const alertRaid = async (guild: Guild, joins: number, until: number, guildDocument: GuildDocument): Promise<void> => {
    const channel = guild.channels.cache.get(guildDocument.moderationLogChannel);

    if (!channel?.isTextBased()) return;

    const manageable = guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild);
    const atCeiling = guild.verificationLevel === GuildVerificationLevel.VeryHigh;

    const buttons: {
        type: ComponentType.Button;
        label: string;
        style: ButtonStyle;
        customId: string;
        disabled: boolean;
    }[] = [
        {
            type: ComponentType.Button,
            label: "Pause Invites",
            style: ButtonStyle.Danger,
            customId: MessageComponents.RaidPauseInvitesButton,
            disabled: !manageable,
        },
    ];

    if (!atCeiling) {
        buttons.push({
            type: ComponentType.Button,
            label: "Raise Verification",
            style: ButtonStyle.Secondary,
            customId: MessageComponents.RaidVerificationButton,
            disabled: !manageable,
        });
    }

    await channel.send({
        embeds: [
            {
                color: COLORS.RED,
                title: "Possible Raid",
                description: `**${ joins } members** joined within the last minute. Suspicious activity will be dealt with more strictly until <t:${ Math.floor(until / 1000) }:t>.${ manageable ? "" : "\n-# I need the **Manage Server** permission to pause invites or raise the verification level." }`,
                timestamp: new Date().toISOString(),
            },
        ],
        components: [
            {
                type: ComponentType.ActionRow,
                components: buttons,
            },
        ],
    }).catch(Logger.error);
};
