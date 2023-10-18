import crypto from 'crypto';
import {Cache} from "./jsonKVStore.js";

export class CookieSecretManager {
    constructor(storedPath) {
        this.cache = new Cache(storedPath);
        this.secretSize = 32; // 256 bits
    }

    generateCookieSecret() {
        return crypto.randomBytes(this.secretSize).toString('hex');
    }

    generateCookieSecrets(count) {
        console.log('Generating cookie secrets')
        let r = [];
        for (let i = 0; i < count; i++) {
            r.push(this.generateCookieSecret());
        }
        return r;
    }

    getCookies() {
        if (this.cache.get('keys') === null) {
            this.cache.set('keys', this.generateCookieSecrets(5));
        }

        return {keys: this.cache.get('keys')};
    }
}
