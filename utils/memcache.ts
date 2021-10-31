/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

class Memcache {
    private cacheStore: Map<string, unknown>;

    constructor() {
        this.cacheStore = new Map<string, unknown>();
    }

    public get = (key: string): unknown => {
        return this.cacheStore.get(key);
    };

    public set = (key: string, value: unknown, timeout?: number): boolean => {
        this.cacheStore.set(key, value);

        if (timeout) {
            setTimeout(() => this.cacheStore.delete(key), timeout * 6e4);
        }

        return true;
    };

    public delete = (key: string): unknown => {
        const item = this.cacheStore.get(key);

        if (item) {
            this.cacheStore.delete(key);
            return item;
        }

        return null;
    };

    public clear = (): boolean => {
        this.cacheStore.clear();
        return true;
    };
}

export default new Memcache();
