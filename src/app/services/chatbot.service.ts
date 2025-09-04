import axios from "axios";
import Lead from "../models/leads.model";
import Escalation from "../models/escalation.model";
import ChatHistory from "../models/chatHistory.model";
import logger from "../../utils/logger";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../middlewares";
import { getCache, setCache, deleteCache } from "../../utils/helper/redis";

const AI_BACKEND_URL = `${process.env.AI_BACKEND_URL}/api/v1` || "";
const CHAT_CACHE_TTL = parseInt(process.env.CHAT_CACHE_TTL || "300", 10);
const ESCALATION_CONFIDENCE_THRESHOLD = parseFloat(
  process.env.ESCALATION_CONFIDENCE_THRESHOLD || "0.5"
);

class ChatbotService {
  /**
   * Proxy user query to AI Core Backend
   * Handles history, caching, and escalation
   */
  static async createChat(
    userId: string | null,
    message: string,
    userEmail?: string
  ) {
    try {
      if (!AI_BACKEND_URL) {
        throw new InternalServerError("AI backend not configured");
      }

      // 🔹 Guests: just forward provided history
      let chatHistory: any[] = [];
      if (userId && userId !== "guest") {
        const storedHistory = await ChatHistory.findOne({ userId });
        chatHistory = storedHistory ? storedHistory.messages.map((m) => ({
          content: m.content,
          role: m.role,
        })) : [];
      }

      // Build payload for Core
      const payload = {
        chat_history: chatHistory,
        message,
      };

      logger.info(
        `➡️ Sending to AI backend | user: ${userId || "guest"} | message: "${message}"`
      );

      const response = await axios.post(`${AI_BACKEND_URL}/chat`, payload);

      if (!response.data?.data) {
        throw new BadRequestError("Invalid AI response");
      }

      const {
        response: aiResponse,
        confidence_score,
        escalated,
        escalation_reason,
      } = response.data.data;

      // 🔹 Save chat history for logged-in users
      if (userId && userId !== "guest") {
        await this.saveChatHistory(userId, message, aiResponse, confidence_score);
      }

      // 🔹 Escalation handling
      let escalationId: string | null = null;
      if (confidence_score < ESCALATION_CONFIDENCE_THRESHOLD) {
        try {
          const escalation = new Escalation({
            query: message,
            userEmail: userEmail || "guest",
          });
          await escalation.save();
          escalationId = escalation._id.toString();

          logger.warn(
            `⚠️ Escalation created for ${userEmail || "guest"} | reason: ${escalation_reason}`
          );
        } catch (err: any) {
          logger.error(`❌ Failed to create escalation: ${err.message}`);
        }
      }

      const result = {
        answer: aiResponse,
        confidence: confidence_score,
        escalated,
        escalationId,
      };

      return result;
    } catch (error: any) {
      logger.error(`❌ Chat proxy error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to proxy chat");
    }
  }

  /**
   * Save chat history for authenticated users
   */
  static async saveChatHistory(
    userId: string,
    query: string,
    response: string,
    confidence: number
  ) {
    try {
      const history = await ChatHistory.findOne({ userId });

      const userMessage = {
        content: query,
        role: "user" as const,
        timestamp: new Date(),
      };

      const botMessage = {
        content: response,
        role: "assistant" as const,
        confidence,
        timestamp: new Date(),
      };

      if (history) {
        history.messages.push(userMessage, botMessage);
        await history.save();
      } else {
        await ChatHistory.create({
          userId,
          messages: [userMessage, botMessage],
        });
      }

      logger.info(`📝 Chat history updated for user: ${userId}`);
      return true;
    } catch (error: any) {
      logger.error(`Save chat history error: ${error.message}`);
      throw new InternalServerError(
        error.message || "Failed to save chat history"
      );
    }
  }

  /**
   * Get chat history (cached for speed)
   */
  static async getChatHistory(userId: string) {
    try {
      const cacheKey = `chat_history:${userId}`;
      const cached = await getCache<any>(cacheKey);
      if (cached) {
        logger.info(`Cache hit for chat history: ${userId}`);
        return cached;
      }

      const history = await ChatHistory.findOne({ userId });
      if (!history) throw new NotFoundError("No chat history found");

      await setCache(cacheKey, history, CHAT_CACHE_TTL);

      logger.info(`Chat history retrieved for user: ${userId}`);
      return history;
    } catch (error: any) {
      logger.error(`Get chat history error: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(
        error.message || "Failed to fetch chat history"
      );
    }
  }

  /**
   * Clear chat history for a user
   */
  static async clearChatHistory(userId: string) {
    try {
      await ChatHistory.deleteOne({ userId });
      await deleteCache(`chat_history:${userId}`);
      logger.info(`🗑️ Chat history cleared for user: ${userId}`);
      return true;
    } catch (error: any) {
      logger.error(`Clear chat history error: ${error.message}`);
      throw new InternalServerError(
        error.message || "Failed to clear chat history"
      );
    }
  }

  /**
   * Get all escalations
   */
  static async getAllEscalations(page = 1, limit = 10) {
    try {
      if (page < 1 || limit < 1)
        throw new BadRequestError("Invalid page or limit");

      const escalations = await Escalation.find()
        .skip((page - 1) * limit)
        .limit(limit);

      logger.info(`Escalations retrieved: page ${page}, limit ${limit}`);
      return escalations;
    } catch (error: any) {
      logger.error(`Escalations retrieval error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError(
        error.message || "Failed to retrieve escalations"
      );
    }
  }

  /**
   * Save lead
   */
  static async createLead(email: string, query: string) {
    try {
      const lead = new Lead({ email, query });
      await lead.save();

      logger.info(`Lead captured: ${email}`);
      return lead;
    } catch (error: any) {
      logger.error(`Lead save error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to save lead");
    }
  }

  static async assignLead(leadId: string, userId: string) {
    try {
      const lead = await Lead.findById(leadId);
      if (!lead) throw new NotFoundError("Lead not found");

      lead.assignedTo = userId;
      lead.status = "assigned";
      await lead.save();

      logger.info(`Lead ${leadId} assigned to user ${userId}`);
      return lead;
    } catch (error: any) {
      logger.error(`Assign lead error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to assign lead");
    }
  }
}

export default ChatbotService;
