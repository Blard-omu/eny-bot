"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const user_controller_1 = tslib_1.__importDefault(require("../controllers/user.controller"));
const auth_1 = require("../middlewares/auth");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router
    .route('/')
    .get(auth_1.isLoggedIn, auth_1.checkAdmin, user_controller_1.default.getAllUsers)
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Mongo ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router
    .route("/:id")
    .get(auth_1.isLoggedIn, user_controller_1.default.getUserById)
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Mongo ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router
    .route("/:id")
    .patch(auth_1.isLoggedIn, auth_1.authorizeUser, user_controller_1.default.updateUser)
    .all(middlewares_1.methodNotAllowed);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user Data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Invalid role or missing data
 *       404:
 *         description: User not found
 */
router
    .route('/:id')
    .patch(auth_1.isLoggedIn, auth_1.checkSuperAdmin, user_controller_1.default.updateUser)
    .all(middlewares_1.methodNotAllowed);
/**
* @swagger
* /user/{id}:
*   delete:
*     summary: Delete a user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: Mongo ID of the user
*         schema:
*           type: string
*     responses:
*       200:
*         description: User deleted successfully
*       404:
*         description: User not found
*/
router
    .route("/:id")
    .delete(auth_1.isLoggedIn, auth_1.checkSuperAdmin, user_controller_1.default.deleteUser)
    .all(middlewares_1.methodNotAllowed);
exports.default = router;
