"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app/app"));
const configs_1 = require("./configs");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
const users_1 = require("./database/seeder/users");
const config_db_1 = tslib_1.__importDefault(require("./database/config.db"));
dotenv_1.default.config();
const PORT = configs_1.CONFIG.APPLICATION.PORT || 4000;
const LOCAL_HOST = configs_1.CONFIG.APPLICATION.HOST || 'http://localhost';
const BASE_URL = configs_1.CONFIG.APPLICATION.BASE_URL;
const MONGODB_URI = configs_1.CONFIG.MONGODB.URI; // mongodb
if (process.env.NODE_ENV !== 'test') {
    (0, config_db_1.default)(MONGODB_URI)
        .then(async () => {
        await (0, users_1.createSeedUsers)();
        app_1.default.listen(PORT, () => {
            const baseUrl = process.env.NODE_ENV === 'production'
                ? `${BASE_URL}`
                : `${LOCAL_HOST}:${PORT}`;
            logger_1.default.info(`✅ Server running on port ${PORT}`);
            logger_1.default.info(`API BaseUrl available at: ${baseUrl}/api/v1`);
            logger_1.default.info(`********************************`);
            logger_1.default.info(`Swagger docs available at: ${baseUrl}/api/v1/docs`);
        });
    })
        .catch((err) => logger_1.default.error(`❌ MongoDB connection error: ${err}`));
}
