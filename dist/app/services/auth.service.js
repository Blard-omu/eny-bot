"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_model_1 = tslib_1.__importDefault(require("../models/user.model"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const auth_1 = require("../../utils/helper/auth");
const helper_1 = require("../../utils/helper");
const middlewares_1 = require("../middlewares");
class AuthService {
    /**
     * Register a new user
     */
    static async registerUser(username, phone, email, password) {
        try {
            const existingUser = await user_model_1.default.findOne({ email });
            if (existingUser)
                throw new middlewares_1.BadRequestError("User already exists");
            const hashedPassword = await (0, auth_1.hashPassword)(password);
            const newUser = new user_model_1.default({
                username,
                phone,
                email,
                password: hashedPassword,
            });
            await newUser.save();
            const token = (0, helper_1.generateToken)({ userId: newUser.id, role: newUser.role });
            logger_1.default.info(`✅ User registered: ${email}`);
            return {
                user: {
                    username,
                    phone,
                    email,
                },
                token
            };
        }
        catch (error) {
            logger_1.default.error(`❌ Registration error: ${error.message}`);
            if (error instanceof middlewares_1.BadRequestError)
                throw error;
            return new middlewares_1.InternalServerError(error.message || "Failed to register user");
        }
    }
    /**
     * Login user and return JWT token
     */
    static async loginUser(email, password) {
        try {
            const user = await user_model_1.default.findOne({ email }).select("+password");
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            const isMatch = await (0, auth_1.comparePassword)(password, user.password);
            if (!isMatch)
                throw new middlewares_1.UnauthorizedError("Wrong password");
            const token = (0, helper_1.generateToken)({ userId: user.id, role: user.role });
            logger_1.default.info(`✅ User logged in: ${email}`);
            return {
                user: {
                    username: user.username,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                },
                token,
            };
        }
        catch (error) {
            logger_1.default.error(`❌ Login error: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError ||
                error instanceof middlewares_1.UnauthorizedError)
                throw error;
            throw new middlewares_1.InternalServerError(error.message || "Failed to login user");
        }
    }
    /**
     * Forgot Password - Generate Reset Token
     */
    static async forgotPassword(email) {
        try {
            const user = await user_model_1.default.findOne({ email });
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            const resetToken = (0, helper_1.generateToken)({ userId: user.id, role: user.role });
            logger_1.default.info(`🔑 Password reset token generated for: ${email}`);
            return resetToken;
        }
        catch (error) {
            logger_1.default.error(`❌ Forgot password error: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError(error.message || "Failed to generate reset token");
        }
    }
    /**
     * Reset Password
     */
    static async resetPassword(userId, newPassword) {
        try {
            const user = await user_model_1.default.findById(userId);
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            user.password = await (0, auth_1.hashPassword)(newPassword);
            await user.save();
            logger_1.default.info(`🔄 Password reset for user: ${user.email}`);
            return user;
        }
        catch (error) {
            logger_1.default.error(`❌ Reset password error: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError(error.message || "Failed to reset password");
        }
    }
}
exports.default = AuthService;
