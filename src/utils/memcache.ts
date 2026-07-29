/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
interface MemcacheEntry {
    /** The cached value. */
    v: unknown;
    /** When the item expires, in milliseconds since the epoch. Items without one never expire. */
    exp?: number;
}

/** How often the leftovers of expired items are reclaimed, in milliseconds. */
const SWEEP_INTERVAL = 6e4;

class Memcache {
    private store: Map<string, MemcacheEntry>;

    constructor() {
        this.store = new Map<string, MemcacheEntry>();

        setInterval(this.sweep, SWEEP_INTERVAL).unref();
    }

    /** Looks up an item, dropping it if it has expired since it was last touched. */
    private resolve = (key: string): MemcacheEntry => {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (entry.exp && entry.exp <= Date.now()) {
            this.store.delete(key);
            return null;
        }

        return entry;
    };

    /** Reclaims the expired items which nothing has touched since. */
    private sweep = (): void => {
        for (const key of this.store.keys()) this.resolve(key);
    };

    public get = (key: string): unknown => {
        return this.resolve(key)?.v;
    };

    public set = (key: string, value: unknown, minutes?: number): boolean => {
        this.store.set(key, { v: value, exp: minutes ? Date.now() + minutes * 6e4 : undefined });

        return true;
    };

    public delete = (key: string): unknown => {
        const entry = this.resolve(key);
        if (!entry) return null;

        this.store.delete(key);

        return entry.v;
    };

    public clear = (): boolean => {
        this.store.clear();

        return true;
    };
}

export default new Memcache();
