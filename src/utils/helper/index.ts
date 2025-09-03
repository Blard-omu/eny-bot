import jwt from "jsonwebtoken";
import { ValidationError } from 'express-validator';
import { CONFIG } from "../../configs";
import dotenv from "dotenv"
import crypto from "crypto";
import { RequestHandler, Request, Response, NextFunction } from "express";



dotenv.config()



/**
 * Generate JWT Token
 */
export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, CONFIG.APPLICATION.JWT_SECRET!, { expiresIn: "7d" });
};

/**
 * Verify JWT Token
 */
export const verifyToken = <T = AuthPayload>(token: string): T => {
  try {
    return jwt.verify(token, CONFIG.APPLICATION.JWT_SECRET!) as T;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};



export const generateWalletAddress = () => {
  return "CW" + crypto.randomBytes(16).toString("hex").toUpperCase();
};


export const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);



export const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.map(err => {
    const field = (err as any).path || (err as any).param || 'field';
    const message = err.msg || 'Invalid input';
    return { field, message };
  });
};

// enums/investment.enum.ts
export enum InvestmentDuration {
  SEVEN_DAYS = '7d',
  TWO_WEEKS = '14d',
  ONE_MONTH = '1mo',
  THREE_MONTHS = '3mo',
  SIX_MONTHS = '6mo',
  ONE_YEAR = '1yr',
}

export const durationToDays = (duration: InvestmentDuration): number => {
  switch (duration) {
    case InvestmentDuration.SEVEN_DAYS:
      return 7;
    case InvestmentDuration.TWO_WEEKS:
      return 14;
    case InvestmentDuration.ONE_MONTH:
      return 30;
    case InvestmentDuration.THREE_MONTHS:
      return 90;
    case InvestmentDuration.SIX_MONTHS:
      return 180;
    case InvestmentDuration.ONE_YEAR:
      return 365;
    default:
      throw new Error('Invalid investment duration');
  }
};


// src/utils/helper/dates.ts

/**
 * Calculates a future date by adding the given number of days to the current date.
 * @param days Number of days to add
 * @returns Future Date
 */
export function calculateFutureDate(days: number): Date {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}
