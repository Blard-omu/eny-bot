import User from "../models/user.model";
import logger from "../../utils/logger";
import { hashPassword, comparePassword } from "../../utils/helper/auth";
import { generateToken } from "../../utils/helper";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError
} from "../middlewares";

class AuthService {
  /**
   * Register a new user
   */
  static async registerUser(
    username: string,
    phone: string,
    email: string,
    password: string
  ) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new BadRequestError("User already exists");

      const hashedPassword = await hashPassword(password);
      const newUser = new User({
        username,
        phone,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const token = generateToken({ userId: newUser.id, role: newUser.role });

      logger.info(`✅ User registered: ${email}`);
      return {
        username,
        phone,
        email,
        token
      };
    } catch (error: any) {
      logger.error(`❌ Registration error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      return new InternalServerError(error.message || "Failed to register user");
    }
  }

  /**
   * Login user and return JWT token
   */
  static async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) throw new NotFoundError("User not found");

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) throw new UnauthorizedError("Wrong password");

      const token = generateToken({ userId: user.id, role: user.role });

      logger.info(`✅ User logged in: ${email}`);
      return {
        user: {
          username: user.username,
          phone: user.phone,
          email: user.email,
        },
        token,
      };
    } catch (error: any) {
      logger.error(`❌ Login error: ${error.message}`);
      if (
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      )
        throw error;
      throw new InternalServerError(error.message || "Failed to login user");
    }
  }



  /**
   * Forgot Password - Generate Reset Token
   */
  static async forgotPassword(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new NotFoundError("User not found");

      const resetToken = generateToken({ userId: user.id, role: user.role });

      logger.info(`🔑 Password reset token generated for: ${email}`);
      return resetToken;
    } catch (error: any) {
      logger.error(`❌ Forgot password error: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(error.message || "Failed to generate reset token");
    }
  }

  /**
   * Reset Password
   */
  static async resetPassword(userId: string, newPassword: string) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError("User not found");

      user.password = await hashPassword(newPassword);
      await user.save();

      logger.info(`🔄 Password reset for user: ${user.email}`);
      return user;
    } catch (error: any) {
      logger.error(`❌ Reset password error: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(error.message || "Failed to reset password");
    }
  }
}

export default AuthService;