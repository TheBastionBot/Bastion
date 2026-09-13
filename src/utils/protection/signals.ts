/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { WindowEntry } from "./window.js";

export type SignalType = "honeypot" | "duplicateSpray" | "repeatedLink" | "crossChannelFlood"
    | "cumulativeMentions" | "editToLink" | "messageRate" | "newAccountLink";

export interface Signal {
    type: SignalType;
    weight: number;
    /** The multiplier applied to the weight when the member is established. */
    dampener: number;
    evidence: string;
}

export interface SignalContext {
    honeypot: boolean;
    /**
     * Hostnames in the latest message that weren't present in the message's
     * previous content. Empty both when nothing changed and when the
     * previous content isn't known.
     */
    newHostnames: string[];
    /** Age of the account in milliseconds. */
    accountAge: number;
    /** Time since the member joined the guild, in milliseconds. */
    memberAge: number;
}

const BURST_WINDOW = 15e3;
const BURST_CHANNELS = 3;
const DUPLICATE_CHANNELS = 3;
const LINK_CHANNELS = 2;
const DUPLICATE_WINDOW = 3e5;
const MENTION_TOTAL = 15;
const RATE_WINDOW = 5e3;
const RATE_MESSAGES = 6;
const NEW_ACCOUNT = 6048e5;
const RECENT_JOIN = 6e5;

const channelCount = (entries: WindowEntry[]): number => new Set(entries.map(entry => entry.channel)).size;

/**
 * Evaluate a member's recent messages and return every signal that fired.
 * @param entries The member's messages inside the window, oldest first.
 * @param context Details about the latest message that aren't in the window.
 */
export const evaluate = (entries: WindowEntry[], context: SignalContext): Signal[] => {
    const signals: Signal[] = [];

    const latest = entries[entries.length - 1];
    if (!latest) return signals;

    if (context.honeypot) {
        signals.push({
            type: "honeypot",
            weight: 5,
            dampener: 0.4,
            evidence: "Posted in the honeypot channel",
        });
    }

    // identical text or attachment repeated across channels. no legitimate
    // member does this, so it isn't dampened for established members.
    const withinWindow = entries.filter(entry => latest.timestamp - entry.timestamp <= DUPLICATE_WINDOW);

    const textDuplicates = latest.hash !== 0 && withinWindow.filter(entry => entry.hash === latest.hash);
    const attachmentDuplicates = withinWindow.filter(entry => entry.attachments.some(attachment => latest.attachments.includes(attachment)));

    const strongDuplicates = withinWindow.filter(entry =>
        (textDuplicates && entry.hash === latest.hash)
        || entry.attachments.some(attachment => latest.attachments.includes(attachment)));

    if (channelCount(strongDuplicates) >= DUPLICATE_CHANNELS) {
        // name only the arm that itself reached the channel threshold; fall
        // back to a neutral description otherwise.
        const evidence = textDuplicates && channelCount(textDuplicates) >= DUPLICATE_CHANNELS
            ? `Same content repeated in ${ channelCount(textDuplicates) } channels`
            : attachmentDuplicates.length && channelCount(attachmentDuplicates) >= DUPLICATE_CHANNELS
                ? `Same attachment repeated in ${ channelCount(attachmentDuplicates) } channels`
                : `Same content or attachment repeated in ${ channelCount(strongDuplicates) } channels`;

        signals.push({
            type: "duplicateSpray",
            weight: 4,
            dampener: 1,
            evidence,
        });
    } else {
        // weaker, dampened alternative to duplicateSpray; mutually exclusive
        // with it so one event isn't counted twice. uses the lower
        // LINK_CHANNELS threshold.
        const sharedHost = latest.hostnames.find(host => withinWindow.some(entry => entry !== latest && entry.hostnames.includes(host)));
        const hostDuplicates = sharedHost && withinWindow.filter(entry => entry.hostnames.includes(sharedHost));

        if (hostDuplicates && channelCount(hostDuplicates) >= LINK_CHANNELS) {
            signals.push({
                type: "repeatedLink",
                weight: 2,
                dampener: 0.8,
                evidence: `Same link (${ sharedHost }) repeated in ${ channelCount(hostDuplicates) } channels`,
            });
        }
    }

    const burst = entries.filter(entry => latest.timestamp - entry.timestamp <= BURST_WINDOW);

    if (channelCount(burst) >= BURST_CHANNELS) {
        signals.push({
            type: "crossChannelFlood",
            weight: 3,
            dampener: 0.8,
            evidence: `Posted in ${ channelCount(burst) } channels within ${ BURST_WINDOW / 1e3 } seconds`,
        });
    }

    const mentions = entries.reduce((total, entry) => total + entry.mentions, 0);

    if (mentions >= MENTION_TOTAL) {
        signals.push({
            type: "cumulativeMentions",
            weight: 2,
            dampener: 0.8,
            evidence: `Sent ${ mentions } mentions across ${ entries.length } messages`,
        });
    }

    if (context.newHostnames.length) {
        signals.push({
            type: "editToLink",
            weight: 2,
            dampener: 0.8,
            evidence: `Message edited to add a link to ${ context.newHostnames.join(", ") }`,
        });
    }

    const rate = entries.filter(entry => latest.timestamp - entry.timestamp <= RATE_WINDOW);

    if (rate.length >= RATE_MESSAGES) {
        signals.push({
            type: "messageRate",
            weight: 1,
            dampener: 0.8,
            evidence: `Sent ${ rate.length } messages within ${ RATE_WINDOW / 1e3 } seconds`,
        });
    }

    if (latest.hostnames.length && (context.accountAge < NEW_ACCOUNT || context.memberAge < RECENT_JOIN)) {
        signals.push({
            type: "newAccountLink",
            weight: 1,
            dampener: 0,
            evidence: "A new account posted a link",
        });
    }

    return signals;
};
