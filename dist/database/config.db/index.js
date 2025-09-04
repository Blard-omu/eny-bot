"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
/**
 * Establishes a connection to a database (PostgreSQL or MongoDB).
 * @param {PoolConfig | string} options - Database connection options (PostgreSQL config or MongoDB URL).
 * @returns {Pool | typeof mongoose} - The connected database instance.
 */
const connectDb = async (options) => {
    if (typeof options === "string") {
        if (options.startsWith("mongodb://") || options.startsWith("mongodb+srv://")) {
            try {
                const connection = await mongoose_1.default.connect(options);
                logger_1.default.info("✅ Connected to MongoDB successfully.");
                return connection;
            }
            catch (error) {
                logger_1.default.error(`❌ MongoDB connection error: ${error}`);
                process.exit(1);
            }
        }
        else if (options.startsWith("postgres://") || options.startsWith("postgresql://")) {
            try {
                const pool = new pg_1.Pool({ connectionString: options, ssl: {
                        rejectUnauthorized: false,
                    }, });
                await pool.connect();
                logger_1.default.info("✅ Connected to PostgreSQL successfully.");
                pool.on("error", (err) => {
                    logger_1.default.error(`❌ PostgreSQL runtime error: ${err}`);
                    process.exit(1);
                });
                return pool;
            }
            catch (err) {
                logger_1.default.error(`❌ PostgreSQL connection error: ${err}`);
                process.exit(1);
            }
        }
        else {
            logger_1.default.error("❌ Unknown database URI format.");
            process.exit(1);
        }
    }
    else {
        try {
            const pool = new pg_1.Pool(options);
            await pool.connect(); // Force immediate connection
            logger_1.default.info("✅ Connected to PostgreSQL successfully.");
            pool.on("error", (err) => {
                logger_1.default.error(`❌ PostgreSQL runtime error: ${err}`);
                process.exit(1);
            });
            return pool;
        }
        catch (err) {
            logger_1.default.error(`❌ PostgreSQL connection error: ${err}`);
            process.exit(1);
        }
    }
};
exports.default = connectDb;
