"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const logger_1 = tslib_1.__importDefault(require("../logger"));
/**
 * Hash a plain password using bcrypt
 * @param password - The raw password to hash
 * @returns Promise<string>
 */
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.genSalt(12, (err, salt) => {
            if (err) {
                logger_1.default.error(`Salt Error: ${err}`);
                return reject(err);
            }
            bcrypt_1.default.hash(password, salt, (err, hash) => {
                if (err) {
                    logger_1.default.error(`Hash Error: ${err}`);
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.hashPassword = hashPassword;
/**
 * Compare a raw password with a hashed one
 * @param password - Raw input password
 * @param hashed - Previously hashed password
 * @returns Promise<boolean>
 */
const comparePassword = (password, hashed) => {
    return bcrypt_1.default.compare(password, hashed);
};
exports.comparePassword = comparePassword;
