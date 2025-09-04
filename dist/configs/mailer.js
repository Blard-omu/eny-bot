"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const configs_1 = require("../configs");
const logger_1 = tslib_1.__importDefault(require("../utils/logger"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: configs_1.CONFIG.MAIL.MAIL_USER, // Brevo login email
        pass: configs_1.CONFIG.MAIL.MAIL_PASS, // Brevo SMTP key
    },
});
const sendVerificationEmail = async (to, token) => {
    try {
        const link = `${configs_1.CONFIG.APPLICATION.FRONTEND_URL}/api/auth/verify-email?token=${token}`;
        const html = `
      <h2>Welcome to CryptWalli 👋</h2>
      <p>Please confirm your email address by clicking the link below:</p>
      <a href="${link}" style="color: #5c4efc; font-weight: bold;">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `;
        await transporter.sendMail({
            from: `"Hermex" <${configs_1.CONFIG.MAIL.MAIL_USER}>`,
            to,
            subject: "Verify your email address",
            html,
        });
        logger_1.default.info(`📧 Verification email sent to ${to}`);
    }
    catch (error) {
        logger_1.default.error(`❌ Failed to send verification email to ${to}: ${error}`);
        throw new Error("Failed to send verification email. Please try again later.");
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
