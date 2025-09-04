import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ChatbotService from "../services/chatbot.service";
import logger from "../../utils/logger";
import { formatValidationErrors } from "../../utils/helper";
import { ValidationError } from "../middlewares";

class ChatbotController {
  /**
   * Proxy chat to AI Core Backend
   * Automatically saves history and escalates if confidence is low
   */
  static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(formatValidationErrors(result.array()));
      }

      const { message } = req.body;
      const userId = (req as any).user?.id || "guest";
      const userEmail = (req as any).user?.email || "guest";

      // ✅ For guests, pass along chat_history from frontend
      // ✅ For logged-in users, service will fetch from DB
      const aiResponse = await ChatbotService.createChat(
        userId,
        message,
        userEmail,
      );      

      res.status(200).json({
        status: "success",
        data: aiResponse,
      });
    } catch (err: any) {
      logger.error(`❌ Chat error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Get chat history
   */
  static async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId || userId === "guest") {
        res.status(200).json({
          status: "success",
          data: [],
          message: "Guest users do not have stored history",
        });
      }

      const history = await ChatbotService.getChatHistory(userId);

      res.status(200).json({
        status: "success",
        data: history,
      });
    } catch (err: any) {
      logger.error(`❌ Get chat history error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Clear chat history
   */
  static async clearChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId || userId === "guest") {
        return res.status(400).json({
          status: "fail",
          message: "Guests cannot clear history",
        });
      }

      await ChatbotService.clearChatHistory(userId);

      res.status(200).json({
        status: "success",
        message: "Chat history cleared",
      });
    } catch (err: any) {
      logger.error(`❌ Clear chat history error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Get Escalations
   */
  static async getAllEscalations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const escalations = await ChatbotService.getAllEscalations(
        Number(page),
        Number(limit)
      );
      res.status(200).json({
        status: "success",
        data: escalations,
      });
    } catch (error) {
      logger.error(`❌ Get escalations error: ${(error as any).message}`);
      return next(error);
    }
  }

  /**
   * Save lead
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(formatValidationErrors(result.array()));
      }

      const { email, query } = req.body;
      const lead = await ChatbotService.createLead(email, query);

      res.status(201).json({
        status: "success",
        message: "Lead captured",
        data: lead,
      });
    } catch (err: any) {
      logger.error(`❌ Lead save error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Assign lead to a marketer
   */
  static async assignLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { leadId, userId } = req.body; // userId = marketer

      const lead = await ChatbotService.assignLead(leadId, userId);

      res.status(200).json({
        status: "success",
        message: "Lead assigned successfully",
        data: lead,
      });
    } catch (err: any) {
      logger.error(`❌ Assign lead error: ${err.message}`);
      return next(err);
    }
  }
}

export default ChatbotController;


