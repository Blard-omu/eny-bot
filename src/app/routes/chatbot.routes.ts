import express from "express";
import ChatbotController from "../controllers/chatbot.controller";
import { isLoggedIn, checkAdmin } from "../middlewares/auth";
import { methodNotAllowed } from "../middlewares";
import {
  chatValidator,
  leadValidator,
} from "../middlewares/validations/chat";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chats
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
  .post(leadValidator, ChatbotController.createLead)
  .all(methodNotAllowed);

/**
 * @swagger
 * /leads/assign:
 *   post:
 *     summary: Assign a lead to a marketing/sales team member
 *     description: Admins can assign a captured lead to a marketing or sales team member for follow-up.
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
 *               - leadId
 *               - userId
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 64a8e2fba9c12345bcdf6789
 *               userId:
 *                 type: string
 *                 example: 42b29ac-7736-40e6-ba09-9ba1509bbc99
 *     responses:
 *       200:
 *         description: Lead assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden – admin access required
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router
  .route("/leads/assign")
  .post(isLoggedIn, checkAdmin, ChatbotController.assignLead)
  .all(methodNotAllowed);

/**
 * @swagger
 * /history:
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
  .route("/history")
  .get(isLoggedIn, ChatbotController.getChatHistory)
  .all(methodNotAllowed);

/**
 * @swagger
 * /escalations:
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
  .route("/escalations")
  .get(isLoggedIn, checkAdmin, ChatbotController.getAllEscalations)
  .all(methodNotAllowed);

export default router;
