import { createClient } from "redis";
import logger from "../logger";

const redisUrl = process.env.REDIS_URL as string;

if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}

const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  logger.error(`❌ Redis Client Error: ${err.message}`);
});

(async () => {
  try {
    await client.connect();
    logger.info("✅ Connected to Redis Cloud");
  } catch (err: any) {
    logger.error(`❌ Redis connection failed: ${err.message}`);
  }
})();

/**
 * Store value in Redis with expiry
 */
export const setCache = async (key: string, value: any, ttlSeconds = 300) => {
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err: any) {
    logger.error(`❌ Redis setCache error: ${err.message}`);
  }
};

/**
 * Get value from Redis
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await client.get(key);

    if (!data) return null;

    // Normalize Buffer to string before parsing
    const str = typeof data === "string" ? data : data.toString();
    return JSON.parse(str) as T;
  } catch (err: any) {
    logger.error(`❌ Redis getCache error: ${err.message}`);
    return null;
  }
};

/**
 * Delete a key from Redis
 */
export const deleteCache = async (key: string) => {
  try {
    await client.del(key);
  } catch (err: any) {
    logger.error(`❌ Redis deleteCache error: ${err.message}`);
  }
};

export default client;
