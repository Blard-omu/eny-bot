"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const auth_controller_1 = tslib_1.__importDefault(require("../controllers/auth.controller"));
const auth_1 = require("../middlewares/validations/auth");
const middlewares_1 = require("../middlewares");
const helper_1 = require("../../utils/helper");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, phone, password]
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router
    .route("/register")
    .post(auth_1.validateRegister, (0, helper_1.asyncHandler)(auth_controller_1.default.register))
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router
    .route("/login")
    .post(auth_1.validateLogin, (0, helper_1.asyncHandler)(auth_controller_1.default.login))
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset token sent
 *       404:
 *         description: User not found
 */
router
    .route("/forgot-password")
    .post((0, helper_1.asyncHandler)(auth_controller_1.default.forgotPassword))
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, newPassword]
 *             properties:
 *               userId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error or user not found
 */
router
    .route("/reset-password")
    .post((0, helper_1.asyncHandler)(auth_controller_1.default.resetPassword))
    .all(middlewares_1.methodNotAllowed);
exports.default = router;
