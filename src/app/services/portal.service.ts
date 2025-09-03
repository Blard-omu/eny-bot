import axios from 'axios';
import Redis from 'ioredis';
import logger from '../../utils/logger';
import Lead from '../models/leads.model';
import Escalation from '../models/escalation.model';
import ChatHistory from '../models/chatHistory.model';
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from '../middlewares';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8001/api';

interface ChatResponse {
  answer: string;
  confidence: number;
}

class PortalService {
  /**
   * Proxy chat query to AI Core Backend
   */
  static async proxyChatToAICore(query: string, userId?: string): Promise<ChatResponse> {
    try {
      if (!query) throw new BadRequestError('Query is required');

      const cacheKey = `chat:${query}:${userId || 'guest'}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for chat query: ${query}`);
        return JSON.parse(cached);
      }

      const response = await axios.post(`${AI_BACKEND_URL}/chat`, { query, userId });
      const result = response.data as ChatResponse;

      await redis.setex(cacheKey, 3600, JSON.stringify(result)); // Cache for 1 hour
      logger.info(`Chat query processed: ${query}`);
      return result;
    } catch (error: any) {
      logger.error(` Chat proxy error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError('Failed to process chat query with AI Core', error.stack);
    }
  }

  /**
   * Create an escalation for a low-confidence query
   */
  static async createEscalation(query: string, userEmail: string) {
    try {
      if (!query || !userEmail) throw new BadRequestError('Query and userEmail are required');

      const escalation = new Escalation({ query, userEmail });
      const savedEscalation = await escalation.save();

      logger.info(`Escalation created for: ${userEmail}`);
      return savedEscalation;
    } catch (error: any) {
      logger.error(` Escalation error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError('Failed to create escalation', error.stack);
    }
  }

  /**
   * Capture lead information
   */
  static async createLead(email: string, query: string) {
    try {
      if (!email || !query) throw new BadRequestError('Email and query are required');

      const lead = new Lead({ email, query });
      const savedLead = await lead.save();

      logger.info(`Lead captured: ${email}`);
      return savedLead;
    } catch (error: any) {
      logger.error(` Lead creation error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError('Failed to create lead', error.stack);
    }
  }

  /**
   * Store user chat history
   */
  static async storeChatHistory(userId: string, query: string, response: string, confidence: number) {
    try {
      if (!userId || !query || !response || confidence === undefined) {
        throw new BadRequestError('userId, query, response, and confidence are required');
      }

      const message = { query, response, confidence, timestamp: new Date() };
      const chatHistory = await ChatHistory.findOneAndUpdate(
        { userId },
        { $push: { messages: message }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, new: true }
      );

      logger.info(`Chat history stored for user: ${userId}`);
      return chatHistory;
    } catch (error: any) {
      logger.error(` Chat history error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError('Failed to store chat history', error.stack);
    }
  }

  /**
   * Retrieve user chat history
   */
  static async getChatHistory(userId: string) {
    try {
      if (!userId) throw new BadRequestError('userId is required');

      const chatHistory = await ChatHistory.findOne({ userId });
      if (!chatHistory) throw new NotFoundError('Chat history not found');

      logger.info(`Chat history retrieved for user: ${userId}`);
      return chatHistory;
    } catch (error: any) {
      logger.error(` Chat history retrieval error: ${error.message}`);
      if (error instanceof BadRequestError || error instanceof NotFoundError) throw error;
      throw new InternalServerError('Failed to retrieve chat history', error.stack);
    }
  }

  /**
   * Retrieve all escalations (admin only)
   */
  static async getAllEscalations(page: number = 1, limit: number = 10) {
    try {
      if (page < 1 || limit < 1) throw new BadRequestError('Invalid page or limit');

      const escalations = await Escalation.find()
        .skip((page - 1) * limit)
        .limit(limit);

      logger.info(`Escalations retrieved: page ${page}, limit ${limit}`);
      return escalations;
    } catch (error: any) {
      logger.error(` Escalations retrieval error: ${error.message}`);
      if (error instanceof BadRequestError) throw error;
      throw new InternalServerError('Failed to retrieve escalations', error.stack);
    }
  }
}

export default PortalService;
