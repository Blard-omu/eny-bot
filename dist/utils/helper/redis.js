"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.getCache = exports.setCache = void 0;
const tslib_1 = require("tslib");
const redis_1 = require("redis");
const logger_1 = tslib_1.__importDefault(require("../logger"));
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("❌ REDIS_URL is not defined in environment variables");
}
const client = (0, redis_1.createClient)({ url: redisUrl });
client.on("error", (err) => {
    logger_1.default.error(`❌ Redis Client Error: ${err.message}`);
});
(async () => {
    try {
        await client.connect();
        logger_1.default.info("✅ Connected to Redis Cloud");
    }
    catch (err) {
        logger_1.default.error(`❌ Redis connection failed: ${err.message}`);
    }
})();
/**
 * Store value in Redis with expiry
 */
const setCache = async (key, value, ttlSeconds = 300) => {
    try {
        await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    }
    catch (err) {
        logger_1.default.error(`❌ Redis setCache error: ${err.message}`);
    }
};
exports.setCache = setCache;
/**
 * Get value from Redis
 */
const getCache = async (key) => {
    try {
        const data = await client.get(key);
        if (!data)
            return null;
        // Normalize Buffer to string before parsing
        const str = typeof data === "string" ? data : data.toString();
        return JSON.parse(str);
    }
    catch (err) {
        logger_1.default.error(`❌ Redis getCache error: ${err.message}`);
        return null;
    }
};
exports.getCache = getCache;
/**
 * Delete a key from Redis
 */
const deleteCache = async (key) => {
    try {
        await client.del(key);
    }
    catch (err) {
        logger_1.default.error(`❌ Redis deleteCache error: ${err.message}`);
    }
};
exports.deleteCache = deleteCache;
exports.default = client;
