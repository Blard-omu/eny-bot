import express from 'express';
import UserController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import { isLoggedIn, checkAdmin, authorizeUser, checkSuperAdmin } from '../middlewares/auth';
import { methodNotAllowed } from '../middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with username and password through the Hermex Auth system. Returns access and refresh tokens along with user details.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: blard
 *               password:
 *                 type: string
 *                 example: Password1234
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: JWT access token
 *                 refresh_token:
 *                   type: string
 *                   description: JWT refresh token
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: a42b29ac-7736-40e6-ba09-9ba1509bbc99
 *                     username:
 *                       type: string
 *                       example: blard
 *                     email:
 *                       type: string
 *                       example: blard@example.com
 *                     first_name:
 *                       type: string
 *                       example: Peter
 *                     last_name:
 *                       type: string
 *                       example: Omu
 *                     role:
 *                       type: string
 *                       example: admin
 *                     country:
 *                       type: string
 *                       example: Usa
 *                     phone_number:
 *                       type: string
 *                       example: +1234567890
 *       401:
 *         description: Invalid username or password
 */
router
  .route('/login')
  .post(AuthController.login)
  .all(methodNotAllowed);


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
 *               firstName:
 *                 type: string
 *               lastName:
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


/**
 * @swagger
 * /user/{id}/role:
 *   patch:
 *     summary: Update a user's role
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
 *                 enum: [user, admin, business]
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

export default router;
