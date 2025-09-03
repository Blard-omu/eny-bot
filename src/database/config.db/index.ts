import { Pool, PoolConfig } from "pg";
import mongoose from "mongoose";
import logger from "../../utils/logger";

/**
 * Establishes a connection to a database (PostgreSQL or MongoDB).
 * @param {PoolConfig | string} options - Database connection options (PostgreSQL config or MongoDB URL).
 * @returns {Pool | typeof mongoose} - The connected database instance.
 */
const connectDb = async (options: PoolConfig | string) => {
  if (typeof options === "string") {
    if (options.startsWith("mongodb://") || options.startsWith("mongodb+srv://")) {
      try {
        const connection = await mongoose.connect(options);
        logger.info("✅ Connected to MongoDB successfully.");
        return connection;
      } catch (error) {
        logger.error(`❌ MongoDB connection error: ${error}`);
        process.exit(1);
      }
    } else if (options.startsWith("postgres://") || options.startsWith("postgresql://")) {
      try {
        const pool = new Pool({ connectionString: options, ssl: {
          rejectUnauthorized: false,
        }, });
        await pool.connect();
        logger.info("✅ Connected to PostgreSQL successfully.");
        pool.on("error", (err: Error) => {
          logger.error(`❌ PostgreSQL runtime error: ${err}`);
          process.exit(1);
        });
        return pool;
      } catch (err) {
        logger.error(`❌ PostgreSQL connection error: ${err}`);
        process.exit(1);
      }
    } else {
      logger.error("❌ Unknown database URI format.");
      process.exit(1);
    }
  } else {
    try {
      const pool = new Pool(options);
      await pool.connect(); // Force immediate connection
      logger.info("✅ Connected to PostgreSQL successfully.");
      pool.on("error", (err: any) => {
        logger.error(`❌ PostgreSQL runtime error: ${err}`);
        process.exit(1);
      });
      return pool;
    } catch (err) {
      logger.error(`❌ PostgreSQL connection error: ${err}`);
      process.exit(1);
    }
  }
};

export default connectDb;
