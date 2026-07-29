/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
class Memcache {
    private store: Map<string, unknown>;
    private expiries: Map<string, NodeJS.Timeout>;

    constructor() {
        this.store = new Map<string, unknown>();
        this.expiries = new Map<string, NodeJS.Timeout>();
    }

    private cancel = (key: string): void => {
        clearTimeout(this.expiries.get(key));
        this.expiries.delete(key);
    };

    public get = (key: string): unknown => {
        return this.store.get(key);
    };

    public set = (key: string, value: unknown, minutes?: number): boolean => {
        this.cancel(key);
        this.store.set(key, value);

        if (minutes) {
            this.expiries.set(key, setTimeout(() => this.delete(key), minutes * 6e4).unref());
        }

        return true;
    };

    public delete = (key: string): unknown => {
        if (!this.store.has(key)) return null;

        const item = this.store.get(key);

        this.cancel(key);
        this.store.delete(key);

        return item;
    };

    public clear = (): boolean => {
        for (const expiry of this.expiries.values()) clearTimeout(expiry);

        this.expiries.clear();
        this.store.clear();

        return true;
    };
}

export default new Memcache();
