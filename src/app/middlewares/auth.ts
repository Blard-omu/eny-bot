import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { CONFIG } from '../../configs';
import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../middlewares';
import logger from '../../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin' | 'super_admin';
    email?: string;
  };
}

// 🔐 Require authentication
export const isLoggedIn = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error('🚫 Unauthorized: No token provided');
      return next(new UnauthorizedError('Unauthorized: No token provided'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, CONFIG.APPLICATION.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const user = await User.findById(decoded.userId).select('_id role email');
    if (!user) {
      logger.error('🚫 Unauthorized: User not found');
      return next(new UnauthorizedError('Unauthorized: User not found'));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err: any) {
    logger.error(`❌ Auth middleware error: ${err.message}`);
    if (
      err instanceof NotFoundError ||
      err instanceof ForbiddenError ||
      err instanceof BadRequestError ||
      err instanceof UnauthorizedError
    )
      return next(err);
    return next(new InternalServerError('Authentication failed', err.stack));
  }
};

// 🔐 Allow only Admins and Superadmins
export const checkAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const role = req.user?.role;
  if (!role || !['admin', 'superadmin'].includes(role)) {
    logger.error('🚫 Forbidden: Admins only');
    return next(new ForbiddenError('Access denied: Admins only'));
  }
  next();
};

// 🔐 Allow only Superadmin
export const checkSuperAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'super_admin') {
    logger.error('🚫 Forbidden: Superadmins only');
    return next(new ForbiddenError('Access denied: Superadmins only'));
  }
  next();
};

// 🔐 Allow only same user or superadmin
export const authorizeUser = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const requestedUserId = req.params.userId || req.body.userId;
  const authUser = req.user;

  if (!authUser) {
    return next(new UnauthorizedError('User not authenticated'));
  }

  if (authUser.id !== requestedUserId && authUser.role !== 'super_admin') {
    logger.error('🚫 Forbidden: User not authorized to access this resource');
    return next(new ForbiddenError('Not allowed to modify this resource'));
  }

  next();
};