"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const CONFIG = Object.freeze({
    WELCOME: {
        MESSAGE: `API BaseUrl:  https://eny-bot.onrender.com/api/v1`,
        PORT: Number(process.env.APPLICATION_PORT) || 4000,
        SWAGGER_DOC: process.env.SWAGGER_URL || "",
    },
    APPLICATION: {
        PORT: Number(process.env.APPLICATION_PORT) || 4000,
        ENVIRONMENT: process.env.APPLICATION_ENVIRONMENT || "development",
        JWT_SECRET: process.env.APPLICATION_JWT_SECRET || "enybot",
        ACCESS_TOKEN_EXPIRES_IN: process.env.APPLICATION_ACCESS_TOKEN_EXPIRES_IN || "1h",
        REFRESH_TOKEN_EXPIRES_IN: process.env.APPLICATION_REFRESH_TOKEN_EXPIRES_IN || "7d",
        RESET_TOKEN_EXPIRES_IN: process.env.APPLICATION_RESET_TOKEN_EXPIRES_IN || "1h",
        OTP_EXPIRES_IN: process.env.APPLICATION_OTP_EXPIRES_IN || "5m",
        IS_WORKER: process.env.APPLICATION_IS_WORKER?.toLowerCase() === "true",
        FRONTEND_URL: process.env.APPLICATION_FRONTEND_URL || "",
        DOMAIN: process.env.APPLICATION_DOMAIN || "",
        HOST: process.env.APPLICATION_HOST || "",
        BASE_URL: process.env.APPLICATION_BASE_URL || "",
        FLASK_BASE_URL: process.env.APPLICATION_FLASK_BASE_URL || "http://127.0.0.1:5000",
        RULE_ENGINE_URL: process.env.APPLICATION_RULE_ENGINE_URL || "https://backend.enybot.com",
    },
    POSTGRES: {
        HOST: process.env.POSTGRES_HOST || "localhost",
        PORT: Number(process.env.POSTGRES_PORT) || 5432,
        DB: process.env.POSTGRES_DB || "postgres",
        USERNAME: process.env.POSTGRES_USER || "user",
        PASSWORD: process.env.POSTGRES_PASSWORD || "password",
    },
    MONGODB: {
        URI: process.env.MONGODB_URI || "",
    },
    POSTGRES_CLOUD: {
        URI: process.env.PGCLOUD_DATABASE_URI || ""
    },
    MAIL: {
        DOMAIN: process.env.MAIL_DOMAIN_NAME || "",
        KEY: process.env.MAIL_API_KEY || "",
        USERNAME: process.env.MAIL_API_USERNAME || "",
        FROM: process.env.MAIL_FROM || "",
        FROM_NAME: process.env.MAIL_FROM_NAME || "",
        INQUIRY_DESTINATION: process.env.MAIL_INQUIRY_DESTINATION || "",
        // BREVO
        MAIL_USER: process.env.MAIL_FROM || "",
        MAIL_PASS: process.env.MAIL_FROM || "",
    },
});
exports.CONFIG = CONFIG;
