"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_validator_1 = require("express-validator");
const chatbot_service_1 = tslib_1.__importDefault(require("../services/chatbot.service"));
const logger_1 = tslib_1.__importDefault(require("../../utils/logger"));
const helper_1 = require("../../utils/helper");
const middlewares_1 = require("../middlewares");
class ChatbotController {
    /**
     * Proxy chat to AI Core Backend
     * Automatically saves history and escalates if confidence is low
     */
    static async chat(req, res, next) {
        try {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                throw new middlewares_1.ValidationError((0, helper_1.formatValidationErrors)(result.array()));
            }
            const { message } = req.body;
            const userId = req.user?.id || "guest";
            const userEmail = req.user?.email || "guest";
            // ✅ For guests, pass along chat_history from frontend
            // ✅ For logged-in users, service will fetch from DB
            const aiResponse = await chatbot_service_1.default.createChat(userId, message, userEmail);
            res.status(200).json({
                status: "success",
                data: aiResponse,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Chat error: ${err.message}`);
            return next(err);
        }
    }
    /**
     * Get chat history
     */
    static async getChatHistory(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId || userId === "guest") {
                res.status(200).json({
                    status: "success",
                    data: [],
                    message: "Guest users do not have stored history",
                });
            }
            const history = await chatbot_service_1.default.getChatHistory(userId);
            res.status(200).json({
                status: "success",
                data: history,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Get chat history error: ${err.message}`);
            return next(err);
        }
    }
    /**
     * Clear chat history
     */
    static async clearChatHistory(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId || userId === "guest") {
                return res.status(400).json({
                    status: "fail",
                    message: "Guests cannot clear history",
                });
            }
            await chatbot_service_1.default.clearChatHistory(userId);
            res.status(200).json({
                status: "success",
                message: "Chat history cleared",
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Clear chat history error: ${err.message}`);
            return next(err);
        }
    }
    /**
     * Get Escalations
     */
    static async getAllEscalations(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const escalations = await chatbot_service_1.default.getAllEscalations(Number(page), Number(limit));
            res.status(200).json({
                status: "success",
                data: escalations,
            });
        }
        catch (error) {
            logger_1.default.error(`❌ Get escalations error: ${error.message}`);
            return next(error);
        }
    }
    /**
     * Save lead
     */
    static async createLead(req, res, next) {
        try {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                throw new middlewares_1.ValidationError((0, helper_1.formatValidationErrors)(result.array()));
            }
            const { email, query } = req.body;
            const lead = await chatbot_service_1.default.createLead(email, query);
            res.status(201).json({
                status: "success",
                message: "Lead captured",
                data: lead,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Lead save error: ${err.message}`);
            return next(err);
        }
    }
    /**
     * Assign lead to a marketer
     */
    static async assignLead(req, res, next) {
        try {
            const { leadId, userId } = req.body; // userId = marketer
            const lead = await chatbot_service_1.default.assignLead(leadId, userId);
            res.status(200).json({
                status: "success",
                message: "Lead assigned successfully",
                data: lead,
            });
        }
        catch (err) {
            logger_1.default.error(`❌ Assign lead error: ${err.message}`);
            return next(err);
        }
    }
}
exports.default = ChatbotController;
