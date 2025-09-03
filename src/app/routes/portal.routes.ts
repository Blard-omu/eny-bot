import express from 'express';
import ChatController from '../controllers/portal.controller';
import AuthController from '../controllers/auth.controller';
import { isLoggedIn, checkAdmin } from '../middlewares/auth';
import { methodNotAllowed } from '../middlewares';
import {
  validateChatQuery,
  validateEscalation,
  validateLead,
  validateChatHistory,
  validateUserIdParam,
} from '../middlewares/validations/chat';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Portal
 *   description: Student Support & Lead Conversion Portal endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email, username, phone, and password for the ENY Consulting Student Support Portal. Sends a verification email.
 *     tags: [Portal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password1234
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 phone:
 *                   type: string
 *                   example: +1234567890
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route('/register')
  .post(AuthController.register)
  .all(methodNotAllowed);

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Submit a query to the AI Q&A bot
 *     description: Sends a user query to the AI Core Backend for processing and returns the AI's response. Optionally stores chat history for authenticated users.
 *     tags: [Portal]
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
 *             properties:
 *               query:
 *                 type: string
 *                 example: What is the cost of the CBAP certification?
 *               userId:
 *                 type: string
 *                 example: a42b29ac-7736-40e6-ba09-9ba1509bbc99
 *               userEmail:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: AI response with confidence score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   example: The CBAP certification course costs $297...
 *                 confidence:
 *                   type: number
 *                   example: 0.92
 *       201:
 *         description: Query escalated to human support
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Query escalated to human support
 *                 answer:
 *                   type: string
 *                   example: The CBAP certification course costs $297...
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router
  .route('/chat')
  .post(validateChatQuery, ChatController.proxyChatToAICore)
  .all(methodNotAllowed);

/**
 * @swagger
 * /escalate:
 *   post:
 *     summary: Escalate a low-confidence query to human support
 *     description: Stores a query for human follow-up with the user's email.
 *     tags: [Portal]
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
 *                 example: How do I enroll in the CBAP course?
 *               userEmail:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Query escalated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Escalation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route('/escalate')
  .post(validateEscalation, ChatController.createEscalation)
  .all(methodNotAllowed);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Capture lead information
 *     description: Stores lead information for potential students interested in ENY Consulting programs.
 *     tags: [Portal]
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
 *                 example: user@example.com
 *               query:
 *                 type: string
 *                 example: Interested in CBAP enrollment details
 *     responses:
 *       201:
 *         description: Lead captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router
  .route('/leads')
  .post(validateLead, ChatController.createLead)
  .all(methodNotAllowed);

/**
 * @swagger
 * /chat-history:
 *   post:
 *     summary: Store user chat history
 *     description: Stores a user's chat interaction (query, response, confidence) for personalized experience.
 *     tags: [Portal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - query
 *               - response
 *               - confidence
 *             properties:
 *               userId:
 *                 type: string
 *                 example: a42b29ac-7736-40e6-ba09-9ba1509bbc99
 *               query:
 *                 type: string
 *                 example: What is the cost of the CBAP certification?
 *               response:
 *                 type: string
 *                 example: The CBAP certification course costs $297...
 *               confidence:
 *                 type: number
 *                 example: 0.92
 *     responses:
 *       201:
 *         description: Chat history stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router
  .route('/chat-history')
  .post(isLoggedIn, validateChatHistory, ChatController.storeChatHistory)
  .all(methodNotAllowed);

/**
 * @swagger
 * /chat-history:
 *   get:
 *     summary: Retrieve user chat history
 *     description: Fetches the chat history for a specific user by userId.
 *     tags: [Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ID of the user
 *         example: a42b29ac-7736-40e6-ba09-9ba1509bbc99
 *     responses:
 *       200:
 *         description: User's chat history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router
  .route('/chat-history')
  .get(isLoggedIn, validateUserIdParam, ChatController.getChatHistory)
  .all(methodNotAllowed);

/**
 * @swagger
 * /admin/escalations:
 *   get:
 *     summary: View all escalated queries (Admin only)
 *     description: Retrieves a paginated list of escalated queries for admin review.
 *     tags: [Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of escalated queries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Escalation'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden – admin access required
 */
router
  .route('/admin/escalations')
  .get(isLoggedIn, checkAdmin, ChatController.getAllEscalations)
  .all(methodNotAllowed);

export default router;