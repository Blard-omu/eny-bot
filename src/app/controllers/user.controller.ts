
import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import logger from "../../utils/logger";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../middlewares";

class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      logger.info("Retrieved all users");
      res.status(200).json(users);
    } catch (err: any) {
      logger.error(`Failed to get all users: ${err.message}`);
      return next(new InternalServerError("Failed to fetch users", err.stack));
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) throw new NotFoundError("User not found");
      logger.info(`User retrieved: ${id}`);
      res.status(200).json(user);
    } catch (err: any) {
      logger.error(`Failed to get user ${req.params.id}: ${err.message}`);
      if (err instanceof NotFoundError) return next(err);
      return next(new InternalServerError("Failed to fetch user", err.stack));
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(id, req.body);
      if (!updatedUser) throw new NotFoundError("User not found or update failed");
      logger.info(`User updated: ${id}`);
      res.status(200).json(updatedUser);
    } catch (err: any) {
      logger.error(`Failed to update user ${req.params.id}: ${err.message}`);
      if (err instanceof NotFoundError || err instanceof BadRequestError) return next(err);
      return next(new InternalServerError("Failed to update user", err.stack));
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      if (!result) throw new NotFoundError("User not found or already deleted");
      logger.info(`User deleted: ${id}`);
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(`Failed to delete user ${req.params.id}: ${err.message}`);
      if (err instanceof NotFoundError) return next(err);
      return next(new InternalServerError("Failed to delete user", err.stack));
    }
  }
}

export default UserController;