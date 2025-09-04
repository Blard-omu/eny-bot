import express from 'express';
import UserController from '../controllers/user.controller';
import { isLoggedIn, checkAdmin, authorizeUser, checkSuperAdmin } from '../middlewares/auth';
import { methodNotAllowed } from '../middlewares';

const router = express.Router();



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
  .get(isLoggedIn, checkAdmin, UserController.getAllUsers)
  .all(methodNotAllowed);

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
  .get(isLoggedIn, UserController.getUserById)
  .all(methodNotAllowed);

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
  .patch(isLoggedIn, authorizeUser, UserController.updateUser)
  .all(methodNotAllowed);

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
  .patch(isLoggedIn, checkSuperAdmin, UserController.updateUser)
  .all(methodNotAllowed);

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
.delete(isLoggedIn, checkSuperAdmin, UserController.deleteUser)
.all(methodNotAllowed);


export default router;
