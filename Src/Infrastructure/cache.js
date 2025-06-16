export class Cache {
    constructor(cache) {
        this.cache = cache;
    }

    async #set(key, value) {
        return this.cache.set(key, value);
    }
    async #get(key) {
        return this.cache.get(key);
    }
    async getMaxAsset() {
        return await this.#get('max-asset');
    }
    async getPrice() {
        return await this.#get('gold-price');
    }
}



