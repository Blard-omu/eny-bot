"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_service_1 = tslib_1.__importDefault(require("../services/user.service"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const middlewares_1 = require("../middlewares");
class UserController {
    static async getAllUsers(req, res, next) {
        try {
            const users = await user_service_1.default.getAllUsers();
            logger_1.default.info("Retrieved all users");
            res.status(200).json(users);
        }
        catch (err) {
            logger_1.default.error(`Failed to get all users: ${err.message}`);
            return next(new middlewares_1.InternalServerError("Failed to fetch users", err.stack));
        }
    }
    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await user_service_1.default.getUserById(id);
            if (!user)
                throw new middlewares_1.NotFoundError("User not found");
            logger_1.default.info(`User retrieved: ${id}`);
            res.status(200).json(user);
        }
        catch (err) {
            logger_1.default.error(`Failed to get user ${req.params.id}: ${err.message}`);
            if (err instanceof middlewares_1.NotFoundError)
                return next(err);
            return next(new middlewares_1.InternalServerError("Failed to fetch user", err.stack));
        }
    }
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updatedUser = await user_service_1.default.updateUser(id, req.body);
            if (!updatedUser)
                throw new middlewares_1.NotFoundError("User not found or update failed");
            logger_1.default.info(`User updated: ${id}`);
            res.status(200).json(updatedUser);
        }
        catch (err) {
            logger_1.default.error(`Failed to update user ${req.params.id}: ${err.message}`);
            if (err instanceof middlewares_1.NotFoundError || err instanceof middlewares_1.BadRequestError)
                return next(err);
            return next(new middlewares_1.InternalServerError("Failed to update user", err.stack));
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await user_service_1.default.deleteUser(id);
            if (!result)
                throw new middlewares_1.NotFoundError("User not found or already deleted");
            logger_1.default.info(`User deleted: ${id}`);
            res.status(200).json(result);
        }
        catch (err) {
            logger_1.default.error(`Failed to delete user ${req.params.id}: ${err.message}`);
            if (err instanceof middlewares_1.NotFoundError)
                return next(err);
            return next(new middlewares_1.InternalServerError("Failed to delete user", err.stack));
        }
    }
}
exports.default = UserController;
