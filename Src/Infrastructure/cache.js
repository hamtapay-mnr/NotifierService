export class Cache {
    constructor(cache) {
        this.cache = cache;
    }

    #set(key, value) {
        return this.cache.set(key, value);
    }
    #get(key) {
        return this.cache.get(key);
    }
    async getMaxAsset() {
        return await this.#get('max-asset');
    }
    async getPrice() {
        return await this.#get('gold-price');
    }
    async getAdminWarning() {
        return await this.#get('admin-warning-flag');
    }
    async setAdminWarning(state) {
        return await this.#set('admin-warning-flag', state);
    }
}