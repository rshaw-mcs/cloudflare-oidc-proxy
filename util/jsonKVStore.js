import * as fs from "fs";

/**
 * A simple cache class that stores key-value pairs in a JSON file.
 */
export class Cache {
    /**
     * Create a new Cache instance.
     * @param {string} cacheFilePath - The path to the JSON file used for caching.
     */
    constructor(cacheFilePath) {
        /**
         * The path to the JSON file used for caching.
         * @type {string}
         * @private
         */
        this.cacheFilePath = cacheFilePath;

        /**
         * The in-memory cache map.
         * @type {Object.<string, { value: any, expiration: number }>}
         * @private
         */
        this.cacheMap = this.loadCache();
    }

    /**
     * Load the cache from the JSON file.
     * @private
     * @returns {Object.<string, { value: any, expiration: number }>} - The loaded cache map.
     */
    loadCache() {
        try {
            // Check if the cache file exists
            if (fs.existsSync(this.cacheFilePath)) {
                // Read the existing cache file
                return JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf8')) || {};
            } else {
                return {};
            }
        } catch (error) {
            throw new Error(`Error reading cache file: ${error.message}`);
        }
    }

    /**
     * Save the current cache map to the JSON file.
     */
    saveCache() {
        try {
            // Write the entire cache map to the JSON file
            fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cacheMap, null, 2));
        } catch (error) {
            throw new Error("Could not save storage");
        }
    }

    /**
     * Set a key-value pair in the cache.
     * @param {string} key - The key for the value.
     * @param {any} value - The value to be stored.
     * @param {number} [expiration] - The expiration time for the value in seconds.
     */
    set(key, value, expiration) {
        this.cacheMap[key] = { value, expiration: expiration ? Date.now() + expiration * 1000 : undefined };
        this.saveCache();
    }

    /**
     * Get the value associated with a key from the cache.
     * @param {string} key - The key to look up in the cache.
     * @returns {any|null} - The value associated with the key, or null if the key is not found or has expired.
     */
    get(key) {
        // Check if the key is in the cache map
        if (key in this.cacheMap) {
            const { value, expiration } = this.cacheMap[key];

            // Check if the value has an expiration time and if it has expired
            if (expiration === undefined || expiration >= Date.now()) {
                return value;
            }

            // If the value has expired, delete it from the cache
            delete this.cacheMap[key];
            this.saveCache();
        }

        // If the key is not found or the value has expired, return null
        return null;
    }

    /**
     * Delete a key-value pair from the cache.
     * @param {string} key - The key to be deleted.
     * @returns {boolean} - True if the key was found and deleted, false otherwise.
     */
    delete(key) {
        // Check if the key is in the cache map
        if (key in this.cacheMap) {
            // Delete the key from the cache map
            delete this.cacheMap[key];

            // Save the updated cache map to the JSON file
            this.saveCache();
            return true; // Indicate successful deletion
        }

        return false; // Indicate that the key was not found
    }

    /**
     * Get an array of all keys in the cache.
     * @returns {string[]} - An array containing all keys in the cache.
     */
    getKeys() {
        return Object.keys(this.cacheMap);
    }
}
