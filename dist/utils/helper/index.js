"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.durationToDays = exports.InvestmentDuration = exports.formatValidationErrors = exports.asyncHandler = exports.generateWalletAddress = exports.verifyToken = exports.generateToken = void 0;
exports.calculateFutureDate = calculateFutureDate;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const configs_1 = require("../../configs");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
dotenv_1.default.config();
/**
 * Generate JWT Token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, configs_1.CONFIG.APPLICATION.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
/**
 * Verify JWT Token
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, configs_1.CONFIG.APPLICATION.JWT_SECRET);
    }
    catch (err) {
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
const generateWalletAddress = () => {
    return "CW" + crypto_1.default.randomBytes(16).toString("hex").toUpperCase();
};
exports.generateWalletAddress = generateWalletAddress;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
const formatValidationErrors = (errors) => {
    return errors.map(err => {
        const field = err.path || err.param || 'field';
        const message = err.msg || 'Invalid input';
        return { field, message };
    });
};
exports.formatValidationErrors = formatValidationErrors;
// enums/investment.enum.ts
var InvestmentDuration;
(function (InvestmentDuration) {
    InvestmentDuration["SEVEN_DAYS"] = "7d";
    InvestmentDuration["TWO_WEEKS"] = "14d";
    InvestmentDuration["ONE_MONTH"] = "1mo";
    InvestmentDuration["THREE_MONTHS"] = "3mo";
    InvestmentDuration["SIX_MONTHS"] = "6mo";
    InvestmentDuration["ONE_YEAR"] = "1yr";
})(InvestmentDuration || (exports.InvestmentDuration = InvestmentDuration = {}));
const durationToDays = (duration) => {
    switch (duration) {
        case InvestmentDuration.SEVEN_DAYS:
            return 7;
        case InvestmentDuration.TWO_WEEKS:
            return 14;
        case InvestmentDuration.ONE_MONTH:
            return 30;
        case InvestmentDuration.THREE_MONTHS:
            return 90;
        case InvestmentDuration.SIX_MONTHS:
            return 180;
        case InvestmentDuration.ONE_YEAR:
            return 365;
        default:
            throw new Error('Invalid investment duration');
    }
};
exports.durationToDays = durationToDays;
// src/utils/helper/dates.ts
/**
 * Calculates a future date by adding the given number of days to the current date.
 * @param days Number of days to add
 * @returns Future Date
 */
function calculateFutureDate(days) {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now;
}
