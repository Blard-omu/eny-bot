import nodemailer from "nodemailer";
import { CONFIG } from "../configs";
import logger from "../utils/logger";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: CONFIG.MAIL.MAIL_USER, // Brevo login email
    pass: CONFIG.MAIL.MAIL_PASS, // Brevo SMTP key
  },
});

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  try {
    const link = `${CONFIG.APPLICATION.FRONTEND_URL}/api/auth/verify-email?token=${token}`;
    const html = `
      <h2>Welcome to CryptWalli 👋</h2>
      <p>Please confirm your email address by clicking the link below:</p>
      <a href="${link}" style="color: #5c4efc; font-weight: bold;">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await transporter.sendMail({
      from: `"Hermex" <${CONFIG.MAIL.MAIL_USER}>`,
      to,
      subject: "Verify your email address",
      html,
    });

    logger.info(`📧 Verification email sent to ${to}`);
  } catch (error) {
    logger.error(`❌ Failed to send verification email to ${to}: ${error}`);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};

