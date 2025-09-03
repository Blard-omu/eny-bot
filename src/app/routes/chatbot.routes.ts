import express from "express";
import ChatbotController from "../controllers/chatbot.controller";
import { isLoggedIn, checkAdmin } from "../middlewares/auth";
import { methodNotAllowed } from "../middlewares";
import {
  chatValidator,
  escalateValidator,
  leadValidator,
  saveChatHistoryValidator,
} from "../middlewares/validations/chat";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: AI Chatbot, Lead Management, and Escalation endpoints
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Submit a query to the AI Chatbot
 *     description: Sends a user query to the AI Core Backend and retrieves a response. Optionally stores chat history for logged-in users.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: What is the cost of the CBAP certification?
 *     responses:
 *       200:
 *         description: AI response with confidence score
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route("/")
  .post(chatValidator, ChatbotController.chat)
  .all(methodNotAllowed);

/**
 * @swagger
 * /escalate:
 *   post:
 *     summary: Escalate a query to human support
 *     description: Escalates low-confidence queries for manual handling by human support.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *               - userEmail
 *             properties:
 *               query:
 *                 type: string
 *                 example: How do I enroll in CBAP?
 *               userEmail:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Query escalated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route("/escalate")
  .post(escalateValidator, ChatbotController.escalate)
  .all(methodNotAllowed);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Capture lead information
 *     description: Stores lead contact details and query for follow-up by sales/support team.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - query
 *             properties:
 *               email:
 *                 type: string
 *                 example: prospect@example.com
 *               query:
 *                 type: string
 *                 example: Interested in enrolling for CBAP
 *     responses:
 *       201:
 *         description: Lead captured successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route("/leads")
  .post(leadValidator, ChatbotController.saveLead)
  .all(methodNotAllowed);

/**
 * @swagger
 * /chat-history:
 *   post:
 *     summary: Save user chat history
 *     description: Stores a chat interaction (query, response, confidence) for logged-in users.
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *               - response
 *               - confidence
 *             properties:
 *               query:
 *                 type: string
 *               response:
 *                 type: string
 *               confidence:
 *                 type: number
 *                 example: 0.92
 *     responses:
 *       201:
 *         description: Chat history stored successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router
  .route("/chat-history")
  .post(isLoggedIn, saveChatHistoryValidator, ChatbotController.saveChatHistory)
  .all(methodNotAllowed);

/**
 * @swagger
 * /chat-history:
 *   get:
 *     summary: Retrieve chat history
 *     description: Fetches all chat interactions for the logged-in user.
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat history
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router
  .route("/chat-history")
  .get(isLoggedIn, ChatbotController.getChatHistory)
  .all(methodNotAllowed);

/**
 * @swagger
 * /admin/escalations:
 *   get:
 *     summary: Retrieve all escalated queries (Admin only)
 *     description: Fetches all escalations for admin review.
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of escalations
 *       403:
 *         description: Forbidden – admin access required
 */
router
  .route("/admin/escalations")
  .get(isLoggedIn, checkAdmin, ChatbotController.getAllEscalations)
  .all(methodNotAllowed);

export default router;
