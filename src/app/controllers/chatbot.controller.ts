// src/controllers/chatbot.controller.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ChatbotService from "../services/chatBot.service";
import logger from "../../utils/logger";
import { formatValidationErrors } from "../../utils/helper";
import { ValidationError } from "../middlewares";

class ChatbotController {
  /**
   * Proxy chat to AI Core Backend
   */
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(formatValidationErrors(result.array()));
      }

      const { query } = req.body;
      const userId = (req as any).user?.id || "guest";

      const aiResponse = await ChatbotService.proxyChat(userId, query);

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
   * Save chat history
   */
  static async saveChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(formatValidationErrors(result.array()));
      }

      const { query, response, confidence } = req.body;
      const userId = (req as any).user?.id;

      await ChatbotService.saveChatHistory(userId, query, response, confidence);

      res.status(201).json({
        status: "success",
        message: "Chat history saved",
      });
    } catch (err: any) {
      logger.error(`❌ Save chat history error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Get chat history
   */
  static async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

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
   * Escalate query
   */
  static async escalate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(formatValidationErrors(result.array()));
      }

      const { query, userEmail } = req.body;
      const escalation = await ChatbotService.escalateQuery(query, userEmail);

      res.status(201).json({
        status: "success",
        message: "Query escalated",
        data: escalation,
      });
    } catch (err: any) {
      logger.error(`❌ Escalation error: ${err.message}`);
      return next(err);
    }
  }

  /**
   * Get Escalations
   */
  static async getAllEscalations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const escalations = await ChatbotService.getAllEscalations(Number(page), Number(limit));
      res.status(200).json(escalations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save lead
   */
  static async saveLead(req: Request, res: Response, next: NextFunction) {
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
}

export default ChatbotController;
