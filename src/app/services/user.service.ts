import User from "../models/user.model";
import logger from "../../utils/logger";
import {
  InternalServerError,
  NotFoundError,
} from "../middlewares";

class UserService {
  /**
   * Retrieve all users
   */
  static async getAllUsers() {
    try {
      const users = await User.find().select("-password");
      return users;
    } catch (error: any) {
      logger.error(`❌ Error fetching users: ${error.message}`);
      throw new InternalServerError("Could not fetch users", error.stack);
    }
  }

  /**
   * Retrieve a user by ID
   */
  static async getUserById(userId: string) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) throw new NotFoundError("User not found");
      return user;
    } catch (error: any) {
      logger.error(`❌ Error fetching user by ID: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to retrieve user", error.stack);
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(userId: string, updateData: Partial<Record<string, any>>) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
      if (!user) throw new NotFoundError("User not found");
      return user;
    } catch (error: any) {
      logger.error(`❌ Error updating user: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to update user", error.stack);
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) throw new NotFoundError("User not found");
      return { message: "User deleted successfully" };
    } catch (error: any) {
      logger.error(`❌ Error deleting user: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError("Failed to delete user", error.stack);
    }
  }
}

export default UserService;
