import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import logger from "../../utils/logger";
import { validationResult } from 'express-validator';
import { formatValidationErrors } from './../../utils/helper';
import { ValidationError } from "../middlewares";



class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {


    try {
      const result = validationResult(req);
      const errors = result.array();

      if (errors.length > 0) {
        const formatted = formatValidationErrors(errors);
        // console.log(errors);
        throw new ValidationError(formatted);
      }
      const { username, phone, email, password } = req.body;

      const user = await AuthService.registerUser(username, phone, email, password);

      res.status(201).json({
        status: "success",
        message: "Registration successful.",
        user
      });
    } catch (err: any) {
      // logger.error(`❌ Register error: ${err.message}`);
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      const errors = result.array();
      if (errors.length > 0) {
        const formatted = formatValidationErrors(errors);
        throw new ValidationError(formatted);
      }

      const { email, password } = req.body;
      const { user, token } = await AuthService.loginUser(email, password);

      res.status(200).json({
        status: "success",
        message: "Login successful",
        user,
        token,
      });
    } catch (err: any) {
      logger.error(`❌ Login error: ${err.message}`);
      return next(err)
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.forgotPassword(email);

      res.status(200).json({
        status: "success",
        message: "Password reset link has been sent to your email",
        resetToken,
      });
    } catch (err: any) {
      logger.error(`❌ Forgot password error: ${err.message}`);
      return next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, newPassword } = req.body;
      const user = await AuthService.resetPassword(userId, newPassword);

      res.status(200).json({
        status: "success",
        message: "Password reset successful",
        user,
      });
    } catch (err: any) {
      logger.error(`❌ Reset password error: ${err.message}`);
      return next(err);
    }
  }
}

export default AuthController;