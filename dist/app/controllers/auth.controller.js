"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const auth_service_1 = tslib_1.__importDefault(require("../services/auth.service"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const express_validator_1 = require("express-validator");
const helper_1 = require("./../../utils/helper");
const middlewares_1 = require("../middlewares");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = (0, express_validator_1.validationResult)(req);
            const errors = result.array();
            if (errors.length > 0) {
                const formatted = (0, helper_1.formatValidationErrors)(errors);
                // console.log(errors);
                throw new middlewares_1.ValidationError(formatted);
            }
            const { username, phone, email, password } = req.body;
            const user = await auth_service_1.default.registerUser(username, phone, email, password);
            res.status(201).json({
                status: "success",
                message: "Registration successful.",
                user
            });
        }
        catch (err) {
            // logger.error(`❌ Register error: ${err.message}`);
            return next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const result = (0, express_validator_1.validationResult)(req);
            const errors = result.array();
            if (errors.length > 0) {
                const formatted = (0, helper_1.formatValidationErrors)(errors);
                throw new middlewares_1.ValidationError(formatted);
            }
            const { email, password } = req.body;
            const { user, token } = await auth_service_1.default.loginUser(email, password);
            res.status(200).json({
                status: "success",
                message: "Login successful",
                user,
                token,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Login error: ${err.message}`);
            return next(err);
        }
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const resetToken = await auth_service_1.default.forgotPassword(email);
            res.status(200).json({
                status: "success",
                message: "Password reset link has been sent to your email",
                resetToken,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Forgot password error: ${err.message}`);
            return next(err);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { userId, newPassword } = req.body;
            const user = await auth_service_1.default.resetPassword(userId, newPassword);
            res.status(200).json({
                status: "success",
                message: "Password reset successful",
                user,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Reset password error: ${err.message}`);
            return next(err);
        }
    }
}
exports.default = AuthController;
