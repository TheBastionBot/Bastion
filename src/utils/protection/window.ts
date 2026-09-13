/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
export interface WindowEntry {
    /** The message id, so a detected burst can be purged. */
    id: string;
    /** The top-level text or forum channel the message belongs to — for a message in a thread this is the thread's parent channel, otherwise the channel itself. Used for distinct-channel counts. */
    channel: string;
    /** The thread's own id when the message is in a thread, otherwise `null`. Combined with `channel` (as `thread ?? channel`) to find the channel to delete from. */
    thread: string | null;
    timestamp: number;
    /** FNV-1a hash of the normalized content, or 0 when there is no content, or when it normalizes away to nothing (e.g. punctuation- or emoji-only). */
    hash: number;
    hostnames: string[];
    attachments: string[];
    mentions: number;
}

// bounds how much of a burst can be purged. the ring can never report or
// clean up more messages than it holds, so this is the cap on purge coverage.
const RING_SIZE = 15;
const SWEEP_INTERVAL = 6e4;

/** The longest signal window, so nothing older is ever needed. */
export const WINDOW = 3e5;
export const RAID_WINDOW = 6e4;

// must stay above protection's `RAID_JOIN_CEILING`. the ring can
// never report a count higher than its own size, so a ceiling above this
// would be unreachable and large servers would get no raid detection at all.
const RAID_RING_SIZE = 256;

const messages = new Map<string, WindowEntry[]>();
const joins = new Map<string, number[]>();
const raids = new Map<string, number>();

const key = (guild: string, user: string): string => `${ guild }:${ user }`;

/**
 * Record a message and return the member's entries inside the window.
 * @param guild The guild id.
 * @param user The user id.
 * @param entry The message being recorded.
 */
export const record = (guild: string, user: string, entry: WindowEntry): WindowEntry[] => {
    const ring = messages.get(key(guild, user)) ?? [];

    ring.push(entry);
    if (ring.length > RING_SIZE) ring.shift();

    messages.set(key(guild, user), ring);

    return ring.filter(recorded => entry.timestamp - recorded.timestamp <= WINDOW);
};

/**
 * Drop a member's recorded history, so a handled incident can't be detected
 * again from the same messages.
 * @param guild The guild id.
 * @param user The user id.
 */
export const forget = (guild: string, user: string): void => {
    messages.delete(key(guild, user));
};

/**
 * Record a member joining and return how many joined inside the raid window.
 * @param guild The guild id.
 * @param timestamp When the member joined.
 */
export const recordJoin = (guild: string, timestamp: number): number => {
    const ring = joins.get(guild) ?? [];

    ring.push(timestamp);
    if (ring.length > RAID_RING_SIZE) ring.shift();

    joins.set(guild, ring);

    return ring.filter(joined => timestamp - joined <= RAID_WINDOW).length;
};

/**
 * Put a guild into raid mode until the specified time.
 * @param guild The guild id.
 * @param until When raid mode expires.
 */
export const startRaid = (guild: string, until: number): void => {
    raids.set(guild, until);
};

/**
 * Check whether a guild is currently in raid mode.
 * @param guild The guild id.
 * @param now The current time.
 */
export const raiding = (guild: string, now: number): boolean => {
    const until = raids.get(guild);

    if (!until) return false;

    if (until <= now) {
        raids.delete(guild);
        return false;
    }

    return true;
};

/**
 * Drop everything that has fallen out of its window, so idle members and
 * guilds cost nothing.
 * @param now The current time.
 */
export const sweep = (now: number): void => {
    for (const [ member, ring ] of messages) {
        if (now - ring[ring.length - 1].timestamp > WINDOW) messages.delete(member);
    }

    for (const [ guild, ring ] of joins) {
        if (now - ring[ring.length - 1] > RAID_WINDOW) joins.delete(guild);
    }

    for (const [ guild, until ] of raids) {
        if (until <= now) raids.delete(guild);
    }
};

setInterval(() => sweep(Date.now()), SWEEP_INTERVAL).unref();
