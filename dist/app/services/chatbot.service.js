"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const leads_model_1 = tslib_1.__importDefault(require("../models/leads.model"));
const escalation_model_1 = tslib_1.__importDefault(require("../models/escalation.model"));
const chatHistory_model_1 = tslib_1.__importDefault(require("../models/chatHistory.model"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const middlewares_1 = require("../middlewares");
const redis_1 = require("../../utils/helper/redis");
const AI_BACKEND_URL = `${process.env.AI_BACKEND_URL}/api/v1` || "";
const CHAT_CACHE_TTL = parseInt(process.env.CHAT_CACHE_TTL || "300", 10);
const ESCALATION_CONFIDENCE_THRESHOLD = parseFloat(process.env.ESCALATION_CONFIDENCE_THRESHOLD || "0.5");
class ChatbotService {
    /**
     * Proxy user query to AI Core Backend
     * Handles history, caching, and escalation
     */
    static async createChat(userId, message, userEmail) {
        try {
            if (!AI_BACKEND_URL) {
                throw new middlewares_1.InternalServerError("AI backend not configured");
            }
            // 🔹 Guests: just forward provided history
            let chatHistory = [];
            if (userId && userId !== "guest") {
                const storedHistory = await chatHistory_model_1.default.findOne({ userId });
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
            logger_1.default.info(`➡️ Sending to AI backend | user: ${userId || "guest"} | message: "${message}"`);
            const response = await axios_1.default.post(`${AI_BACKEND_URL}/chat`, payload);
            if (!response.data?.data) {
                throw new middlewares_1.BadRequestError("Invalid AI response");
            }
            const { response: aiResponse, confidence_score, escalated, escalation_reason, } = response.data.data;
            // 🔹 Save chat history for logged-in users
            if (userId && userId !== "guest") {
                await this.saveChatHistory(userId, message, aiResponse, confidence_score);
            }
            // 🔹 Escalation handling
            let escalationId = null;
            if (confidence_score < ESCALATION_CONFIDENCE_THRESHOLD) {
                try {
                    const escalation = new escalation_model_1.default({
                        query: message,
                        userEmail: userEmail || "guest",
                    });
                    await escalation.save();
                    escalationId = escalation._id.toString();
                    logger_1.default.warn(`⚠️ Escalation created for ${userEmail || "guest"} | reason: ${escalation_reason}`);
                }
                catch (err) {
                    logger_1.default.error(`❌ Failed to create escalation: ${err.message}`);
                }
            }
            const result = {
                answer: aiResponse,
                confidence: confidence_score,
                escalated,
                escalationId,
            };
            return result;
        }
        catch (error) {
            logger_1.default.error(`❌ Chat proxy error: ${error.message}`);
            throw new middlewares_1.InternalServerError(error.message || "Failed to proxy chat");
        }
    }
    /**
     * Save chat history for authenticated users
     */
    static async saveChatHistory(userId, query, response, confidence) {
        try {
            const history = await chatHistory_model_1.default.findOne({ userId });
            const userMessage = {
                content: query,
                role: "user",
                timestamp: new Date(),
            };
            const botMessage = {
                content: response,
                role: "assistant",
                confidence,
                timestamp: new Date(),
            };
            if (history) {
                history.messages.push(userMessage, botMessage);
                await history.save();
            }
            else {
                await chatHistory_model_1.default.create({
                    userId,
                    messages: [userMessage, botMessage],
                });
            }
            logger_1.default.info(`📝 Chat history updated for user: ${userId}`);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Save chat history error: ${error.message}`);
            throw new middlewares_1.InternalServerError(error.message || "Failed to save chat history");
        }
    }
    /**
     * Get chat history (cached for speed)
     */
    static async getChatHistory(userId) {
        try {
            const cacheKey = `chat_history:${userId}`;
            const cached = await (0, redis_1.getCache)(cacheKey);
            if (cached) {
                logger_1.default.info(`Cache hit for chat history: ${userId}`);
                return cached;
            }
            const history = await chatHistory_model_1.default.findOne({ userId });
            if (!history)
                throw new middlewares_1.NotFoundError("No chat history found");
            await (0, redis_1.setCache)(cacheKey, history, CHAT_CACHE_TTL);
            logger_1.default.info(`Chat history retrieved for user: ${userId}`);
            return history;
        }
        catch (error) {
            logger_1.default.error(`Get chat history error: ${error.message}`);
            if (error instanceof middlewares_1.NotFoundError)
                throw error;
            throw new middlewares_1.InternalServerError(error.message || "Failed to fetch chat history");
        }
    }
    /**
     * Clear chat history for a user
     */
    static async clearChatHistory(userId) {
        try {
            await chatHistory_model_1.default.deleteOne({ userId });
            await (0, redis_1.deleteCache)(`chat_history:${userId}`);
            logger_1.default.info(`🗑️ Chat history cleared for user: ${userId}`);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Clear chat history error: ${error.message}`);
            throw new middlewares_1.InternalServerError(error.message || "Failed to clear chat history");
        }
    }
    /**
     * Get all escalations
     */
    static async getAllEscalations(page = 1, limit = 10) {
        try {
            if (page < 1 || limit < 1)
                throw new middlewares_1.BadRequestError("Invalid page or limit");
            const escalations = await escalation_model_1.default.find()
                .skip((page - 1) * limit)
                .limit(limit);
            logger_1.default.info(`Escalations retrieved: page ${page}, limit ${limit}`);
            return escalations;
        }
        catch (error) {
            logger_1.default.error(`Escalations retrieval error: ${error.message}`);
            if (error instanceof middlewares_1.BadRequestError)
                throw error;
            throw new middlewares_1.InternalServerError(error.message || "Failed to retrieve escalations");
        }
    }
    /**
     * Save lead
     */
    static async createLead(email, query) {
        try {
            const lead = new leads_model_1.default({ email, query });
            await lead.save();
            logger_1.default.info(`Lead captured: ${email}`);
            return lead;
        }
        catch (error) {
            logger_1.default.error(`Lead save error: ${error.message}`);
            throw new middlewares_1.InternalServerError(error.message || "Failed to save lead");
        }
    }
    static async assignLead(leadId, userId) {
        try {
            const lead = await leads_model_1.default.findById(leadId);
            if (!lead)
                throw new middlewares_1.NotFoundError("Lead not found");
            lead.assignedTo = userId;
            lead.status = "assigned";
            await lead.save();
            logger_1.default.info(`Lead ${leadId} assigned to user ${userId}`);
            return lead;
        }
        catch (error) {
            logger_1.default.error(`Assign lead error: ${error.message}`);
            throw new middlewares_1.InternalServerError(error.message || "Failed to assign lead");
        }
    }
}
exports.default = ChatbotService;
