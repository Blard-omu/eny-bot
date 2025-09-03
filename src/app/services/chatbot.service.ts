import axios from "axios";
import Lead  from "../models/leads.model";
import Escalation from "../models/escalation.model";
import ChatHistory from "../models/chatHistory.model";
import logger from "../../utils/logger";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../middlewares";
import { getCache, setCache } from "../../utils/helper/redis";

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "";

class ChatbotService {
  /**
   * Proxy user query to AI Core Backend with Redis caching
   */

  static async proxyChat(userId: string | null, query: string) {
    try {
      if (!AI_BACKEND_URL) {
        throw new InternalServerError("AI backend not configured");
      }

      const cacheKey = `chat:${query}:${userId || "guest"}`;

      const cached = await getCache<any>(cacheKey);
      if (cached) {
        logger.info(`Cache hit for user ${userId || "guest"}: "${query}"`);
        return cached;
      }

      logger.info(`💬 Cache miss. Querying AI backend for: "${query}"`);
      const response = await axios.post(`${AI_BACKEND_URL}/chat`, { query });

      if (!response.data) {
        throw new BadRequestError("Invalid AI response");
      }

      // ✅ Use helper
      await setCache(cacheKey, response.data, 300); 

      return response.data;
    } catch (error: any) {
      logger.error(`❌ Chat proxy error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to proxy chat");
    }
  }

  /**
   * Save chat history for a user
   */
  static async saveChatHistory(
    userId: string,
    query: string,
    response: string,
    confidence: number
  ) {
    try {
      const history = await ChatHistory.findOne({ userId });

      if (history) {
        history.messages.push({ query, response, confidence, timestamp: new Date() });
        await history.save();
      } else {
        await ChatHistory.create({
          userId,
          messages: [{ query, response, confidence, timestamp: new Date() }],
        });
      }

      logger.info(`📝 Chat history saved for user: ${userId}`);
      return true;
    } catch (error: any) {
      logger.error(`Save chat history error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to save chat history");
    }
  }

  /**
   * Get chat history by user
   */
  static async getChatHistory(userId: string) {
    try {
      const history = await ChatHistory.findOne({ userId });
      if (!history) throw new NotFoundError("No chat history found");

      logger.info(`📜 Chat history retrieved for user: ${userId}`);
      return history;
    } catch (error: any) {
      logger.error(`Get chat history error: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(error.message || "Failed to fetch chat history");
    }
  }

  /**
   * Escalate a user query
   */
  static async escalateQuery(query: string, userEmail: string) {
    try {
      const escalation = new Escalation({ query, userEmail });
      await escalation.save();

      logger.info(`⚠️ Escalation created for: ${userEmail}`);
      return escalation;
    } catch (error: any) {
      logger.error(`Escalation error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to escalate query");
    }
  }

  static async getAllEscalations(page: number = 1, limit: number = 10) {
    try {
      if (page < 1 || limit < 1) throw new BadRequestError('Invalid page or limit');

      const escalations = await Escalation.find()
        .skip((page - 1) * limit)
        .limit(limit);

      logger.info(`Escalations retrieved: page ${page}, limit ${limit}`);
      return escalations;
    } catch (error: any) {
      logger.error(`Escalations retrieval error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError(error.message || 'Failed to retrieve escalations');
    }
  }

  /**
   * Save lead information
   */
  static async createLead(email: string, query: string) {
    try {
      const lead = new Lead({ email, query });
      await lead.save();

      logger.info(`📩 Lead captured: ${email}`);
      return lead;
    } catch (error: any) {
      logger.error(`Lead save error: ${error.message}`);
      throw new InternalServerError(error.message || "Failed to save lead");
    }
  }
}

export default ChatbotService;
