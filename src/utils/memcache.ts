/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
class Memcache {
    private store: Map<string, unknown>;

    constructor() {
        this.store = new Map<string, unknown>();
    }

    public get = (key: string): unknown => {
        return this.store.get(key);
    };

    public set = (key: string, value: unknown, minutes?: number): boolean => {
        this.store.set(key, value);

        if (minutes) {
            setTimeout(() => this.store.delete(key), minutes * 6e4).unref();
        }

        return true;
    };

    public delete = (key: string): unknown => {
        const item = this.store.get(key);

        if (item) {
            this.store.delete(key);
            return item;
        }

        return null;
    };

    public clear = (): boolean => {
        this.store.clear();
        return true;
    };
}

export default new Memcache();
