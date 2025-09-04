"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = exports.checkSuperAdmin = exports.checkAdmin = exports.isLoggedIn = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const user_model_1 = tslib_1.__importDefault(require("../models/user.model"));
const configs_1 = require("../../configs");
const middlewares_1 = require("../middlewares");
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
// 🔐 Require authentication
const isLoggedIn = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger_1.default.error('🚫 Unauthorized: No token provided');
            return next(new middlewares_1.UnauthorizedError('Unauthorized: No token provided'));
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, configs_1.CONFIG.APPLICATION.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.userId).select('_id role email');
        if (!user) {
            logger_1.default.error('🚫 Unauthorized: User not found');
            return next(new middlewares_1.UnauthorizedError('Unauthorized: User not found'));
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (err) {
        logger_1.default.error(`❌ Auth middleware error: ${err.message}`);
        if (err instanceof middlewares_1.NotFoundError ||
            err instanceof middlewares_1.ForbiddenError ||
            err instanceof middlewares_1.BadRequestError ||
            err instanceof middlewares_1.UnauthorizedError)
            return next(err);
        return next(new middlewares_1.InternalServerError('Authentication failed', err.stack));
    }
};
exports.isLoggedIn = isLoggedIn;
// 🔐 Allow only Admins and Superadmins
const checkAdmin = (req, _res, next) => {
    const role = req.user?.role;
    if (!role || !['admin', 'superadmin'].includes(role)) {
        logger_1.default.error('🚫 Forbidden: Admins only');
        return next(new middlewares_1.ForbiddenError('Access denied: Admins only'));
    }
    next();
};
exports.checkAdmin = checkAdmin;
// 🔐 Allow only Superadmin
const checkSuperAdmin = (req, _res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        logger_1.default.error('🚫 Forbidden: Superadmins only');
        return next(new middlewares_1.ForbiddenError('Access denied: Superadmins only'));
    }
    next();
};
exports.checkSuperAdmin = checkSuperAdmin;
// 🔐 Allow only same user or superadmin
const authorizeUser = (req, _res, next) => {
    const requestedUserId = req.params.userId || req.body.userId;
    const authUser = req.user;
    if (!authUser) {
        return next(new middlewares_1.UnauthorizedError('User not authenticated'));
    }
    if (authUser.id !== requestedUserId && authUser.role !== 'super_admin') {
        logger_1.default.error('🚫 Forbidden: User not authorized to access this resource');
        return next(new middlewares_1.ForbiddenError('Not allowed to modify this resource'));
    }
    next();
};
exports.authorizeUser = authorizeUser;
