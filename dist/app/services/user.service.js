"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_model_1 = tslib_1.__importDefault(require("../models/user.model"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const middlewares_1 = require("../middlewares");
class UserService {
    /**
     * Retrieve all users
     */
    static async getAllUsers() {
        try {
            const users = await user_model_1.default.find().select("-password");
            return users;
        }
        catch (error) {
            logger_1.default.error(`❌ Error fetching users: ${error.message}`);
            throw new middlewares_1.InternalServerError("Could not fetch users", error.stack);
        }
    }
    /**
     * Retrieve a user by ID
     */
    static async getUserById(userId) {
        try {
            const user = await user_model_1.default.findById(userId).select("-password");
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            return user;
        }
        catch (error) {
            logger_1.default.error(`❌ Error fetching user by ID: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError("Failed to retrieve user", error.stack);
        }
    }
    /**
     * Update user profile
     */
    static async updateUser(userId, updateData) {
        try {
            const user = await user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            return user;
        }
        catch (error) {
            logger_1.default.error(`❌ Error updating user: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError("Failed to update user", error.stack);
        }
    }
    /**
     * Delete a user
     */
    static async deleteUser(userId) {
        try {
            const user = await user_model_1.default.findByIdAndDelete(userId);
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            return { message: "User deleted successfully" };
        }
        catch (error) {
            logger_1.default.error(`❌ Error deleting user: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError("Failed to delete user", error.stack);
        }
    }
}
exports.default = UserService;
