"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeedUsers = void 0;
const tslib_1 = require("tslib");
const user_model_1 = tslib_1.__importStar(require("../../app/models/user.model"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const auth_1 = require("../../utils/helper/auth");
const createSeedUsers = async () => {
    const existing = await user_model_1.default.findOne({ email: 'admin@example.com' });
    if (existing) {
        logger_1.default.info('✅ Seed users already exist.');
        return;
    }
    const users = [
        // Admin
        {
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            phone: '+2348000000001',
            email: 'admin@example.com',
            password: await (0, auth_1.hashPassword)('admin123'),
            role: user_model_1.UserRole.ADMIN,
            isVerified: true,
            isAdmin: true,
        },
        // Users
        {
            firstName: 'Peter',
            lastName: 'Omu',
            username: 'Blard',
            phone: '+2348000000002',
            email: 'blard@example.com',
            password: await (0, auth_1.hashPassword)('blard123'),
            role: user_model_1.UserRole.USER,
            isVerified: true,
        },
    ];
    await user_model_1.default.insertMany(users);
    logger_1.default.info('🌱 Seed users created successfully.');
};
exports.createSeedUsers = createSeedUsers;
