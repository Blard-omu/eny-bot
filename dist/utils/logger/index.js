"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
}));
class Logger {
    logger;
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: "debug", // Default log level
            format: logFormat,
            transports: [
                new winston_1.default.transports.Console(), // Logs to console
                new winston_1.default.transports.File({ filename: "logs/app.log" }) // Logs to a file
            ]
        });
    }
    debug(message) {
        this.logger.debug(message);
    }
    info(message) {
        this.logger.info(message);
    }
    warn(message) {
        this.logger.warn(message);
    }
    error(message) {
        this.logger.error(message);
    }
}
// Export a singleton instance
const logger = new Logger();
exports.default = logger;
